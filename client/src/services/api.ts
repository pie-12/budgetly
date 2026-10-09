const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/** Envelope returned by every Budgetly core API endpoint. */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
}

/** The FastAPI backend serializes Decimal values as fixed-precision strings. */
type Numeric = number | string;

export const toNumber = (value: Numeric | null | undefined): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatVnd = (value: Numeric | null | undefined): string =>
  `${toNumber(value).toLocaleString("en-US")} ₫`;

// --- Entity types (mirror server/schemas) ---

export interface ApiTransaction {
  id: string;
  wallet_id: string;
  category_id: string | null;
  amount: Numeric;
  transaction_type: "INCOME" | "EXPENSE";
  transaction_date: string | null;
  description: string;
  input_method: "MANUAL" | "NLP" | "OCR";
  ai_confidence_score: number | null;
  created_at: string;
  wallet_name: string;
  category_name: string;
  category_icon: string;
  category_color: string;
}

export interface ApiWallet {
  id: string;
  user_id: string;
  name: string;
  balance: Numeric;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface ApiCategory {
  id: string;
  user_id: string | null;
  name: string;
  type: "INCOME" | "EXPENSE";
  icon: string | null;
  color: string | null;
  is_default: boolean;
  created_at: string;
}

export interface ApiBudget {
  id: string;
  user_id: string;
  category_id: string;
  amount_limit: Numeric;
  month_year: string;
  category_name: string;
  category_icon: string;
  category_color: string;
  spent_amount: Numeric;
  created_at: string;
}

export interface ApiCategoryBreakdownItem {
  name: string;
  amount: Numeric;
  percentage: number;
  color: string;
  icon: string;
}

export interface ApiAnalyticsSummary {
  total_balance: Numeric;
  monthly_income: Numeric;
  monthly_expense: Numeric;
  monthly_budget: Numeric;
  remaining_budget: Numeric;
  category_breakdown: ApiCategoryBreakdownItem[];
}

export interface ApiSmartInputResult {
  description: string;
  amount: Numeric;
  category: string;
  type: "INCOME" | "EXPENSE";
  suggested_wallet: string | null;
  confidence_score: number;
}

export interface ApiOcrResult {
  merchant: string | null;
  date: string | null;
  total_amount: Numeric;
  confidence_score: number;
  items: string[];
  suggested_category: string;
}

export interface ApiForecast {
  forecast_total: Numeric;
  budget_limit: Numeric;
  is_at_risk: boolean;
  risk_percentage: number;
  message: string;
}

// --- Request payloads ---

export interface TransactionPayload {
  wallet_id: string;
  category_id?: string | null;
  amount: number;
  transaction_type: "INCOME" | "EXPENSE";
  description?: string;
  transaction_date?: string;
  input_method?: "MANUAL" | "NLP" | "OCR";
  ai_confidence_score?: number;
}

export interface WalletPayload {
  name: string;
  balance: number;
  currency?: string;
}

export interface BudgetPayload {
  category_id: string;
  amount_limit: number;
  month_year: string;
}

// --- Core fetch wrapper ---

async function request<T>(path: string, init?: RequestInit): Promise<ApiEnvelope<T>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch {
    throw new Error("Could not reach the Budgetly API. Is the backend server running?");
  }

  if (!response.ok) {
    let message = `Request failed (HTTP ${response.status})`;
    try {
      const body = await response.json();
      if (typeof body?.detail === "string") message = body.detail;
    } catch {
      // keep the default error message
    }
    throw new Error(message);
  }

  return (await response.json()) as ApiEnvelope<T>;
}

const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const api = {
  // --- Analytics ---
  getSummary: () => request<ApiAnalyticsSummary>("/analytics/summary"),

  // --- Transactions ---
  getTransactions: (limit = 50) => request<ApiTransaction[]>(`/transactions?limit=${limit}`),
  createTransaction: (payload: TransactionPayload) =>
    request<ApiTransaction>("/transactions", jsonInit("POST", payload)),
  deleteTransaction: (id: string) =>
    request<{ deleted_id: string }>(`/transactions/${id}`, { method: "DELETE" }),

  // --- Wallets ---
  getWallets: () => request<ApiWallet[]>("/wallets"),
  createWallet: (payload: WalletPayload) => request<ApiWallet>("/wallets", jsonInit("POST", payload)),

  // --- Categories ---
  getCategories: () => request<ApiCategory[]>("/categories"),

  // --- Budgets ---
  getBudgets: (month?: string) =>
    request<ApiBudget[]>(month ? `/budgets?month=${month}` : "/budgets"),
  saveBudget: (payload: BudgetPayload) => request<ApiBudget>("/budgets", jsonInit("POST", payload)),

  // --- AI services ---
  smartInput: (rawText: string) =>
    request<ApiSmartInputResult>("/ai/smart-input", jsonInit("POST", { raw_text: rawText })),
  scanReceipt: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<ApiOcrResult>("/ai/scan-receipt", { method: "POST", body: form });
  },
  getForecast: () => request<ApiForecast>("/ai/forecast"),
};

// --- UI view models ---

export interface UiTransaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  wallet: string;
  date: string;
}

export const mapApiTransaction = (tx: ApiTransaction): UiTransaction => ({
  id: tx.id,
  description: tx.description || "Untitled transaction",
  amount: toNumber(tx.amount),
  type: tx.transaction_type === "INCOME" ? "income" : "expense",
  category: tx.category_name || "Miscellaneous",
  wallet: tx.wallet_name || "Wallet",
  date: (tx.transaction_date || tx.created_at || "").slice(0, 10),
});

export const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error && error.message ? error.message : fallback;
