"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import OCRScanModal from "@/components/modals/OCRScanModal";
import {
  api,
  ApiCategory,
  ApiWallet,
  getErrorMessage,
  mapApiTransaction,
  UiTransaction,
} from "@/services/api";
import { RefreshCw, AlertCircle, Loader2 } from "lucide-react";

export default function TransactionsPage() {
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
      const [transactionsRes, walletsRes, categoriesRes] = await Promise.all([
        api.getTransactions(100),
        api.getWallets(),
        api.getCategories(),
      ]);
      setTransactions(transactionsRes.data.map(mapApiTransaction));
      setWallets(walletsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải danh sách giao dịch"));
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
      setTransactions((prev) => prev.filter((tx) => tx.id !== String(id)));
    } catch (err) {
      setError(getErrorMessage(err, "Không thể xóa giao dịch"));
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenOCRModal={() => setIsOCRModalOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Sổ Giao Dịch & Lịch Sử Chi Tiêu
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Lịch sử toàn bộ các khoản thu chi kèm bộ lọc thông minh theo thời gian thực
              </p>
            </div>
            <button
              onClick={loadData}
              className="flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>Làm mới</span>
            </button>
          </div>

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

          <div className="min-h-[500px]">
            {isLoading ? (
              <div className="h-96 flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm gap-2 animate-pulse">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600 dark:text-emerald-400" />
                <span>Đang tải danh sách giao dịch...</span>
              </div>
            ) : (
              <RecentTransactions
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}
          </div>

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
        </main>
      </div>
    </div>
  );
}
