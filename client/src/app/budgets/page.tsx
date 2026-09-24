"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const initialBudgets = [
  { id: 1, category: "Ăn uống", limit: 3000000, spent: 2450000, color: "bg-amber-500" },
  { id: 2, category: "Di chuyển", limit: 1000000, spent: 650000, color: "bg-blue-500" },
  { id: 3, category: "Mua sắm", limit: 2000000, spent: 1850000, color: "bg-purple-500" },
  { id: 4, category: "Giải trí", limit: 1500000, spent: 900000, color: "bg-rose-500" },
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("Ăn uống");
  const [limit, setLimit] = useState("");

  const handleSetBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit) return;
    const numLimit = parseFloat(limit);

    setBudgets(
      budgets.map((b) => (b.category === category ? { ...b, limit: numLimit } : b))
    );
    setShowModal(false);
    setLimit("");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenAddModal={() => {}} onOpenOCRModal={() => {}} />
        <main className="flex-1 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Cài đặt & Quản lý Ngân sách</h2>
              <p className="text-xs text-slate-400 mt-1">Thiết lập hạn mức chi tiêu hàng tháng cho từng danh mục</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
            >
              + Thiết lập Ngân sách
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgets.map((b) => {
              const percentage = Math.min((b.spent / b.limit) * 100, 100);
              const isWarning = percentage >= 85;

              return (
                <div key={b.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${b.color}`}></div>
                      <h3 className="font-bold text-slate-100 text-base">{b.category}</h3>
                    </div>
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${
                      isWarning ? "bg-rose-500/20 text-rose-400 border-rose-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                    }`}>
                      {percentage.toFixed(1)}% Hạn mức
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Đã chi: <strong className="text-slate-200">{b.spent.toLocaleString("vi-VN")} ₫</strong></span>
                      <span>Hạn mức: <strong className="text-slate-200">{b.limit.toLocaleString("vi-VN")} ₫</strong></span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className={`h-full ${isWarning ? "bg-gradient-to-r from-amber-500 to-rose-500" : "bg-emerald-500"} transition-all`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Set Budget Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-bold">Thiết lập Ngân sách Tháng</h3>
                <form onSubmit={handleSetBudget} className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Danh mục</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    >
                      <option value="Ăn uống">Ăn uống</option>
                      <option value="Di chuyển">Di chuyển</option>
                      <option value="Mua sắm">Mua sắm</option>
                      <option value="Giải trí">Giải trí</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Hạn mức tiền tối đa (VNĐ)</label>
                    <input
                      type="number"
                      required
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      placeholder="VD: 3000000"
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-xl text-xs bg-slate-800 text-slate-400"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs bg-emerald-600 text-white font-bold"
                    >
                      Cập nhật Ngân sách
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
