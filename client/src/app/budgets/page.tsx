"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

const initialBudgets = [
  { id: 1, category: "Food & Dining", limit: 3000000, spent: 2450000, color: "bg-amber-500" },
  { id: 2, category: "Transportation", limit: 1000000, spent: 650000, color: "bg-blue-500" },
  { id: 3, category: "Shopping", limit: 2000000, spent: 1850000, color: "bg-purple-500" },
  { id: 4, category: "Entertainment", limit: 1500000, spent: 900000, color: "bg-rose-500" },
];

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState(initialBudgets);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState("Food & Dining");
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
              <h2 className="text-2xl font-bold text-slate-100">Budget Management</h2>
              <p className="text-xs text-slate-400 mt-1">Configure spending limits per category for the current month</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
            >
              + Configure Budget
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
                      <h4 className="font-bold text-base text-slate-100">{b.category}</h4>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isWarning
                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                          : "bg-emerald-500/20 text-emerald-400"
                      }`}
                    >
                      {percentage.toFixed(0)}% Utilized
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline text-xs text-slate-400">
                    <span>
                      Spent: <b className="text-slate-100">{b.spent.toLocaleString("en-US")} ₫</b>
                    </span>
                    <span>
                      Cap: <b className="text-slate-200">{b.limit.toLocaleString("en-US")} ₫</b>
                    </span>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full ${isWarning ? "bg-rose-500" : b.color} transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Remaining: {Math.max(b.limit - b.spent, 0).toLocaleString("en-US")} ₫</span>
                    {isWarning && <span className="text-rose-400 font-semibold">⚠️ Nearing Limit</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
                <h3 className="text-lg font-bold text-slate-100 mb-4">Set Budget Cap</h3>
                <form onSubmit={handleSetBudget} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Food & Dining">🍲 Food & Dining</option>
                      <option value="Transportation">🚗 Transportation</option>
                      <option value="Shopping">🛍️ Shopping</option>
                      <option value="Entertainment">🎬 Entertainment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Monthly Limit (VND)
                    </label>
                    <input
                      type="number"
                      required
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      placeholder="e.g. 3000000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="w-1/2 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950"
                    >
                      Save Budget
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
