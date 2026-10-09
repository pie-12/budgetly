"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { api, ApiWallet, getErrorMessage, toNumber } from "@/services/api";

const walletColors = [
  "from-emerald-500/20 to-teal-500/10 border-emerald-500/30",
  "from-blue-500/20 to-indigo-500/10 border-blue-500/30",
  "from-pink-500/20 to-rose-500/10 border-pink-500/30",
  "from-purple-500/20 to-indigo-500/10 border-purple-500/30",
];

const walletIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("cash")) return "💵";
  if (lower.includes("momo") || lower.includes("zalopay") || lower.includes("e-wallet")) return "📱";
  if (lower.includes("bank") || lower.includes("atm") || lower.includes("account")) return "💳";
  return "💰";
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
      setError(getErrorMessage(err, "Failed to load wallets"));
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
      setFormError(getErrorMessage(err, "Could not create the wallet"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenAddModal={() => {}} onOpenOCRModal={() => {}} />
        <main className="flex-1 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Financial Wallets & Accounts</h2>
              <p className="text-xs text-slate-400 mt-1">Manage payment sources, credit cards, and real-time balances</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
            >
              + Add New Wallet
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

          {isLoading ? (
            <div className="h-48 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-sm animate-pulse">
              Loading wallets...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wallets.map((wallet, index) => (
                <div
                  key={wallet.id}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${walletColors[index % walletColors.length]} bg-slate-900 border backdrop-blur-md relative overflow-hidden`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{walletIcon(wallet.name)}</div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 rounded bg-slate-950/60 border border-slate-800">
                      {wallet.currency}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-100 mb-1">{wallet.name}</h3>
                  <div className="text-2xl font-black text-slate-50 mb-4">
                    {toNumber(wallet.balance).toLocaleString("en-US")} ₫
                  </div>
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Status: Active</span>
                    <span className="text-emerald-400 font-semibold cursor-pointer hover:underline">
                      View Details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Wallet Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
                <h3 className="text-lg font-bold text-slate-100 mb-4">+ Add New Wallet</h3>
                <form onSubmit={handleAddWallet} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Wallet Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      placeholder="e.g. Savings Vault"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Initial Balance (VND)
                    </label>
                    <input
                      type="number"
                      required
                      value={newWalletBalance}
                      onChange={(e) => setNewWalletBalance(e.target.value)}
                      placeholder="e.g. 5000000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {formError && (
                    <div className="px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                      ⚠ {formError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="w-1/2 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-xs font-bold text-slate-950"
                    >
                      {isSaving ? "Creating..." : "Create Wallet"}
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
