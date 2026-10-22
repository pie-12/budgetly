"use client";

import { useState } from "react";
import CategoryIcon from "@/components/common/CategoryIcon";
import { Search, Trash2, ArrowDownLeft, ArrowUpRight, Inbox } from "lucide-react";

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

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col h-full transition-colors duration-200">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            Giao Dịch Gần Đây
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Danh sách tất cả các khoản thu chi mới nhất
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm giao dịch..."
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-8 pr-3.5 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-36 sm:w-52 transition-all"
            />
          </div>

          {/* Filter Segmented Buttons */}
          <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 text-xs">
            {(["all", "expense", "income"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  filter === mode
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {mode === "all" ? "Tất cả" : mode === "expense" ? "Khoản Chi" : "Khoản Thu"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction List Items */}
      <div className="space-y-2.5 flex-1 overflow-y-auto pr-1 max-h-[380px]">
        {filteredTransactions.length === 0 ? (
          <div className="h-44 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs gap-2">
            <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600" strokeWidth={1.5} />
            <span>Không tìm thấy giao dịch nào phù hợp</span>
          </div>
        ) : (
          filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="p-3.5 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 dark:bg-slate-950/60 dark:hover:bg-slate-800/50 border border-slate-200/70 hover:border-slate-300 dark:border-slate-800/70 dark:hover:border-slate-700/80 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                    tx.type === "income"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  <CategoryIcon name={tx.category} className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h5 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                    {tx.description}
                  </h5>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    <span>{tx.date}</span>
                    <span>•</span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{tx.wallet}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/50">
                      {tx.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 ml-3">
                <div className="text-right">
                  <span
                    className={`font-bold text-xs sm:text-sm block ${
                      tx.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {tx.amount.toLocaleString("vi-VN")} ₫
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">
                    {tx.type === "income" ? "Khoản thu" : "Khoản chi"}
                  </span>
                </div>

                {onDeleteTransaction && (
                  <button
                    onClick={() => onDeleteTransaction(tx.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                    title="Xóa giao dịch này"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.8} />
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
