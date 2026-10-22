"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SummaryCards from "@/components/dashboard/SummaryCards";
import SmartAIInput from "@/components/dashboard/SmartAIInput";
import AIForecastAlert from "@/components/dashboard/AIForecastAlert";
import ExpenseBreakdownChart from "@/components/dashboard/ExpenseBreakdownChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import OCRScanModal from "@/components/modals/OCRScanModal";
import {
  api,
  ApiAnalyticsSummary,
  ApiCategory,
  ApiWallet,
  getErrorMessage,
  mapApiTransaction,
  toNumber,
  UiTransaction,
} from "@/services/api";
import { AlertCircle, RefreshCw, Loader2 } from "lucide-react";

export default function Home() {
  const [summary, setSummary] = useState<ApiAnalyticsSummary | null>(null);
  const [transactions, setTransactions] = useState<UiTransaction[]>([]);
  const [wallets, setWallets] = useState<ApiWallet[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryRes, transactionsRes, walletsRes, categoriesRes] = await Promise.all([
        api.getSummary(),
        api.getTransactions(20),
        api.getWallets(),
        api.getCategories(),
      ]);
      setSummary(summaryRes.data);
      setTransactions(transactionsRes.data.map(mapApiTransaction));
      setWallets(walletsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải dữ liệu bảng điều khiển"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteTransaction = async (id: number | string) => {
    try {
      await api.deleteTransaction(String(id));
      loadData();
    } catch (err) {
      setError(getErrorMessage(err, "Không thể xóa giao dịch"));
    }
  };

  // Live financial summary from the analytics API
  const totalBalance = toNumber(summary?.total_balance);
  const monthlyIncome = toNumber(summary?.monthly_income);
  const monthlyExpense = toNumber(summary?.monthly_expense);
  const monthlyBudget = toNumber(summary?.monthly_budget);
  const remainingBudget = toNumber(summary?.remaining_budget);
  const categoryBreakdown = (summary?.category_breakdown ?? []).map((item) => ({
    name: item.name,
    amount: toNumber(item.amount),
    color: item.color,
    icon: item.icon,
  }));

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenOCRModal={() => setIsOCRModalOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 flex-1 overflow-y-auto">
          {error && (
            <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-700 dark:text-rose-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" strokeWidth={2} />
                <span>{error}</span>
              </div>
              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 font-bold hover:bg-rose-200 dark:hover:bg-rose-500/30 transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="h-72 flex flex-col items-center justify-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm gap-3 shadow-xs">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span>Đang tải bảng điều khiển tài chính...</span>
            </div>
          ) : (
            <>
              {/* Top Metric Cards */}
              <SummaryCards
                totalBalance={totalBalance}
                monthlyIncome={monthlyIncome}
                monthlyExpense={monthlyExpense}
                remainingBudget={remainingBudget}
                walletCount={wallets.length}
                monthlyBudget={monthlyBudget}
              />

              {/* AI Intelligent NLP Input Bar */}
              <SmartAIInput wallets={wallets} categories={categories} onCreated={loadData} />

              {/* AI Spending Projection & Alert */}
              <AIForecastAlert
                monthlyExpense={monthlyExpense}
                monthlyBudget={monthlyBudget}
              />

              {/* Dashboard Visuals Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2">
                  <RecentTransactions
                    transactions={transactions}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </div>
                <div>
                  <ExpenseBreakdownChart
                    categories={categoryBreakdown}
                    totalExpense={monthlyExpense}
                  />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={loadData}
        wallets={wallets}
        categories={categories}
      />

      <OCRScanModal
        isOpen={isOCRModalOpen}
        onClose={() => setIsOCRModalOpen(false)}
        onCreated={loadData}
        wallets={wallets}
        categories={categories}
      />
    </div>
  );
}
