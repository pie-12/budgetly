"use client";

import { useState } from "react";

export interface Transaction {
  id: number | string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  wallet: string;
  date: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  onDeleteTransaction?: (id: number | string) => void;
}

export default function RecentTransactions({
  transactions,
  onDeleteTransaction,
}: RecentTransactionsProps) {
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((tx) => {
    if (filter !== "all" && tx.type !== filter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        tx.description.toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        tx.wallet.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryIcon = (category: string) => {
    if (category.includes("Ăn") || category.includes("Uống")) return "🍲";
    if (category.includes("Di chuyển") || category.includes("Xăng")) return "🚗";
    if (category.includes("Mua sắm")) return "🛍️";
    if (category.includes("Giải trí")) return "🎬";
    if (category.includes("Lương") || category.includes("Thu nhập")) return "💰";
    return "💸";
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-slate-100 text-base">Giao dịch gần đây</h3>
          <p className="text-xs text-slate-400 mt-0.5">Danh sách các khoản Thu & Chi đã phát sinh</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm giao dịch..."
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 w-44"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filter === "all"
                  ? "bg-slate-800 text-slate-100 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter("expense")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filter === "expense"
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Chi tiêu
            </button>
            <button
              onClick={() => setFilter("income")}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filter === "income"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Thu nhập
            </button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[360px]">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            Không tìm thấy giao dịch nào phù hợp.
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/50 border border-slate-800/80 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-lg">
                  {getCategoryIcon(tx.category)}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200 text-sm">{tx.description}</h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-medium text-slate-300">
                      {tx.category}
                    </span>
                    <span>•</span>
                    <span>{tx.wallet}</span>
                    <span>•</span>
                    <span>{tx.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`font-bold text-sm text-right ${
                    tx.type === "income" ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {tx.amount.toLocaleString("vi-VN")} ₫
                </div>

                {onDeleteTransaction && (
                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    title="Xóa giao dịch"
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
