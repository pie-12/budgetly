"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { api, ApiWallet, getErrorMessage, toNumber } from "@/services/api";
import { Wallet, CreditCard, Smartphone, Banknote, Plus, AlertCircle, RefreshCw, X, Loader2, ArrowRight } from "lucide-react";

const getWalletLucideIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("cash") || lower.includes("tiền mặt")) return Banknote;
  if (lower.includes("momo") || lower.includes("zalopay") || lower.includes("e-wallet") || lower.includes("điện tử")) return Smartphone;
  if (lower.includes("bank") || lower.includes("atm") || lower.includes("ngân hàng")) return CreditCard;
  return Wallet;
};

export default function WalletsPage() {
  const [wallets, setWallets] = useState<ApiWallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getWallets();
      setWallets(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải danh sách ví"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim() || !newWalletBalance) return;

    setIsSaving(true);
    setFormError(null);
    try {
      await api.createWallet({
        name: newWalletName.trim(),
        balance: parseFloat(newWalletBalance),
        currency: "VND",
      });
      setNewWalletName("");
      setNewWalletBalance("");
      setShowAddModal(false);
      loadData();
    } catch (err) {
      setFormError(getErrorMessage(err, "Không thể tạo ví mới"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenAddModal={() => {}} onOpenOCRModal={() => {}} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Ví Tài Chính & Tài Khoản
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Quản lý các nguồn tiền, tài khoản ngân hàng và theo dõi số dư theo thời gian thực
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Ví Mới</span>
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

          {isLoading ? (
            <div className="h-48 flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm gap-2 animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span>Đang tải danh sách ví...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {wallets.map((wallet) => {
                const IconComponent = getWalletLucideIcon(wallet.name);
                return (
                  <div
                    key={wallet.id}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                        <IconComponent className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        {wallet.currency}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 mb-1">{wallet.name}</h3>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white mb-4 font-mono">
                      {toNumber(wallet.balance).toLocaleString("vi-VN")} ₫
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Đang hoạt động
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                        Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add Wallet Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative shadow-2xl transition-colors duration-200">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800 mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Thêm Ví Tài Chính Mới</span>
                  </h3>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleAddWallet} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Tên Ví / Tài Khoản
                    </label>
                    <input
                      type="text"
                      required
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      placeholder="Ví dụ: Tài khoản Vietcombank"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Số Dư Ban Đầu (VNĐ)
                    </label>
                    <input
                      type="number"
                      required
                      value={newWalletBalance}
                      onChange={(e) => setNewWalletBalance(e.target.value)}
                      placeholder="Ví dụ: 5000000"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {formError && (
                    <div className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-xs font-bold text-white shadow-xs flex items-center justify-center gap-1.5"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang tạo...</span>
                        </>
                      ) : (
                        "Tạo Ví Mới"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
