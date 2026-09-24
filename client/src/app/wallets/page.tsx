"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const mockWallets = [
  { id: 1, name: "Ví Tiền mặt", type: "Tiền mặt", balance: 4500000, icon: "💵", color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30" },
  { id: 2, name: "ATM Vietcombank", type: "Tài khoản ngân hàng", balance: 18200000, icon: "💳", color: "from-blue-500/20 to-indigo-500/10 border-blue-500/30" },
  { id: 3, name: "Ví MoMo", type: "Ví điện tử", balance: 1800000, icon: "📱", color: "from-pink-500/20 to-rose-500/10 border-pink-500/30" },
];

export default function WalletsPage() {
  const [wallets, setWallets] = useState(mockWallets);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const [newWalletType, setNewWalletType] = useState("Tài khoản ngân hàng");

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
        icon: newWalletType.includes("ngân hàng") ? "💳" : newWalletType.includes("Ví") ? "📱" : "💵",
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
              <h2 className="text-2xl font-bold text-slate-100">Ví Tài chính & Tài khoản</h2>
              <p className="text-xs text-slate-400 mt-1">Quản lý danh sách các nguồn tiền và số dư tài khoản</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
            >
              + Thêm Ví Mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wallets.map((wallet) => (
              <div
                key={wallet.id}
                className={`p-6 rounded-2xl bg-gradient-to-br ${wallet.color} bg-slate-900 border backdrop-blur-md shadow-xl flex flex-col justify-between h-44`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block">{wallet.type}</span>
                    <h3 className="font-bold text-lg text-slate-100 mt-0.5">{wallet.name}</h3>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xl">
                    {wallet.icon}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-400 font-medium block">Số dư hiện tại</span>
                  <div className="text-2xl font-extrabold text-emerald-400 tracking-tight mt-0.5">
                    {wallet.balance.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Wallet Modal */}
          {showAddModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Thêm Ví Tài chính Mới</h3>
                <form onSubmit={handleAddWallet} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tên ví</label>
                    <input
                      type="text"
                      required
                      value={newWalletName}
                      onChange={(e) => setNewWalletName(e.target.value)}
                      placeholder="VD: Thẻ MB Bank, Ví MoMo phụ..."
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Loại ví</label>
                    <select
                      value={newWalletType}
                      onChange={(e) => setNewWalletType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    >
                      <option value="Tài khoản ngân hàng">Tài khoản ngân hàng</option>
                      <option value="Ví tiền mặt">Ví tiền mặt</option>
                      <option value="Ví điện tử">Ví điện tử (MoMo, ZaloPay)</option>
                      <option value="Thẻ tín dụng">Thẻ tín dụng</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Số dư ban đầu (VNĐ)</label>
                    <input
                      type="number"
                      required
                      value={newWalletBalance}
                      onChange={(e) => setNewWalletBalance(e.target.value)}
                      placeholder="VD: 5000000"
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-400"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs bg-emerald-600 text-white font-bold"
                    >
                      Lưu Ví Mới
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
