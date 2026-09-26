"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const mockWallets = [
  { id: 1, name: "Cash Wallet", type: "Cash", balance: 4500000, icon: "💵", color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30" },
  { id: 2, name: "Bank Account", type: "Checking Account", balance: 18200000, icon: "💳", color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30" },
  { id: 3, name: "E-Wallet", type: "Digital Wallet", balance: 1800000, icon: "📱", color: "from-pink-500/20 to-rose-500/10 border-pink-500/30" },
];

export default function WalletsPage() {
  const [wallets, setWallets] = useState(mockWallets);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const [newWalletType, setNewWalletType] = useState("Bank Account");

  const handleAddWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletName.trim() || !newWalletBalance) return;

    setWallets([
      ...wallets,
      {
        id: Date.now(),
        name: newWalletName,
        type: newWalletType,
        balance: parseFloat(newWalletBalance),
        icon: newWalletType.includes("Bank") ? "💳" : newWalletType.includes("E-Wallet") ? "📱" : "💵",
        color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30",
      },
    ]);

    setNewWalletName("");
    setNewWalletBalance("");
    setShowAddModal(false);
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`p-6 rounded-2xl bg-gradient-to-br ${wallet.color} bg-slate-900 border backdrop-blur-md relative overflow-hidden`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{wallet.icon}</div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 px-2 py-1 rounded bg-slate-950/60 border border-slate-800">
                    {wallet.type}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-100 mb-1">{wallet.name}</h3>
                <div className="text-2xl font-black text-slate-50 mb-4">
                  {wallet.balance.toLocaleString("en-US")} ₫
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
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Wallet Type
                    </label>
                    <select
                      value={newWalletType}
                      onChange={(e) => setNewWalletType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Cash">💵 Cash</option>
                      <option value="Bank Account">💳 Bank Account</option>
                      <option value="E-Wallet">📱 E-Wallet</option>
                    </select>
                  </div>
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
                      className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950"
                    >
                      Create Wallet
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
