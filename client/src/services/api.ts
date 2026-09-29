const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface TransactionPayload {
  wallet_id: string;
  category_id?: string;
  amount: number;
  transaction_type: "INCOME" | "EXPENSE";
  description?: string;
  transaction_date?: string;
  input_method?: "MANUAL" | "NLP" | "OCR";
  ai_confidence_score?: number;
}

export interface SmartInputResult {
  description: string;
  amount: number;
  category: string;
  type: "INCOME" | "EXPENSE";
  suggested_wallet: string;
  confidence_score: number;
}

export const api = {
  // --- Analytics ---
  async getSummary() {
    const res = await fetch(`${API_BASE_URL}/analytics/summary`);
    return res.json();
  },

  // --- Transactions ---
  async getTransactions(limit = 50) {
    const res = await fetch(`${API_BASE_URL}/transactions?limit=${limit}`);
    return res.json();
  },

  async createTransaction(payload: TransactionPayload) {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.json();
  },

  async deleteTransaction(id: string) {
    const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },

  // --- Wallets ---
  async getWallets() {
    const res = await fetch(`${API_BASE_URL}/wallets`);
    return res.json();
  },

  // --- Categories ---
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    return res.json();
  },

  // --- Budgets ---
  async getBudgets(month?: string) {
    const url = month ? `${API_BASE_URL}/budgets?month=${month}` : `${API_BASE_URL}/budgets`;
    const res = await fetch(url);
    return res.json();
  },

  // --- AI Services ---
  async smartInput(rawText: string): Promise<{ success: boolean; data: SmartInputResult }> {
    const res = await fetch(`${API_BASE_URL}/ai/smart-input`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ raw_text: rawText }),
    });
    return res.json();
  },

  async getForecast() {
    const res = await fetch(`${API_BASE_URL}/ai/forecast`);
    return res.json();
  },
};
