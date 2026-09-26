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
    const c = category.toLowerCase();
    if (c.includes("food") || c.includes("dining") || c.includes("ăn")) return "🍲";
    if (c.includes("transport") || c.includes("gas") || c.includes("xe")) return "🚗";
    if (c.includes("shop") || c.includes("mua")) return "🛍️";
    if (c.includes("entertain") || c.includes("giải")) return "🎬";
    if (c.includes("salary") || c.includes("income") || c.includes("lương")) return "💰";
    if (c.includes("utilit") || c.includes("tiện")) return "⚡";
    return "💸";
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col h-full">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-bold text-slate-100 text-base">Recent Transactions</h3>
          <p className="text-xs text-slate-400 mt-0.5">List of all income and expense activities</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-700 w-44 sm:w-56"
            />
          </div>

          {/* Filter Segmented Buttons */}
          <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
            {(["all", "expense", "income"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  filter === mode
                    ? "bg-slate-800 text-slate-100 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {mode === "all" ? "All" : mode === "expense" ? "Expenses" : "Income"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction List Items */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {filteredTransactions.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
            <span className="text-2xl">🔍</span>
            <span>No transactions found matching your criteria</span>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/50 border border-slate-800/70 hover:border-slate-700/80 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shrink-0">
                  {getCategoryIcon(tx.category)}
                </div>
                <div>
                  <h5 className="font-semibold text-sm text-slate-200 group-hover:text-emerald-400 transition-colors">
                    {tx.description}
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span className="text-slate-300 font-medium">{tx.wallet}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300">
                      {tx.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span
                    className={`font-bold text-sm block ${
                      tx.type === "income" ? "text-emerald-400" : "text-slate-100"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {tx.amount.toLocaleString("en-US")} ₫
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-medium">
                    {tx.type}
                  </span>
                </div>

                {onDeleteTransaction && (
                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    title="Delete record"
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
