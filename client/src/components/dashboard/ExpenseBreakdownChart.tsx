"use client";

import CategoryIcon from "@/components/common/CategoryIcon";
import { PieChart } from "lucide-react";

interface CategoryExpense {
  name: string;
  amount: number;
  color: string;
  icon: string;
}

interface ExpenseBreakdownChartProps {
  categories: CategoryExpense[];
  totalExpense: number;
}

export default function ExpenseBreakdownChart({
  categories,
  totalExpense,
}: ExpenseBreakdownChartProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between h-full transition-colors duration-200">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
            <span>Phân Bổ Chi Tiêu</span>
          </h3>
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
            Tháng 10/2026
          </span>
        </div>

        {/* Visual Multi-color Progress Stack Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden mb-6">
          {categories.map((cat, idx) => {
            const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
            return (
              <div
                key={idx}
                className={`h-full ${cat.color} transition-all duration-300`}
                style={{ width: `${percentage}%` }}
                title={`${cat.name}: ${cat.amount.toLocaleString("vi-VN")} ₫ (${percentage.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Category List Details */}
        <div className="space-y-3">
          {categories.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">Chưa có dữ liệu chi tiêu trong kỳ</p>
          ) : (
            categories.map((cat, idx) => {
              const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
              return (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-700/60">
                      <CategoryIcon name={cat.name} icon={cat.icon} className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                      {percentage.toFixed(1)}%
                    </span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 min-w-[70px] text-right font-mono">
                      {cat.amount.toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>Tổng Chi Tiêu Đã Theo Dõi</span>
        <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm font-mono">
          {totalExpense.toLocaleString("vi-VN")} ₫
        </span>
      </div>
    </div>
  );
}
