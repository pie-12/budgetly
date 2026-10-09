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
      setError(getErrorMessage(err, "Failed to load transactions"));
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
      setError(getErrorMessage(err, "Failed to delete the transaction"));
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenOCRModal={() => setIsOCRModalOpen(true)}
        />
        <main className="flex-1 p-8 space-y-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Transaction Management</h2>
              <p className="text-xs text-slate-400 mt-1">
                Complete history of financial ledger entries with instant filtering and search
              </p>
            </div>
            <button
              onClick={loadData}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            >
              ↻ Refresh
            </button>
          </div>

          {error && (
            <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              <span>⚠ {error}</span>
              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 font-semibold hover:bg-rose-500/30 transition-all"
              >
                Retry
              </button>
            </div>
          )}

          <div className="h-[600px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-sm animate-pulse">
                Loading transactions...
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
