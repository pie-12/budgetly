"use client";

import { Wallet, ArrowDownLeft, ArrowUpRight, Target } from "lucide-react";

interface SummaryCardsProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  remainingBudget: number;
  walletCount?: number;
  monthlyBudget?: number;
}

export default function SummaryCards({
  totalBalance,
  monthlyIncome,
  monthlyExpense,
  remainingBudget,
  walletCount,
  monthlyBudget,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Tổng Số Dư",
      amount: totalBalance,
      subtext:
        typeof walletCount === "number"
          ? `Từ ${walletCount} ví tài chính kết nối`
          : "Từ các ví tài chính",
      icon: Wallet,
      iconColor: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200/80 dark:border-indigo-500/20",
      amountColor: "text-slate-900 dark:text-white",
    },
    {
      title: "Thu Nhập Tháng",
      amount: monthlyIncome,
      subtext: "Tổng thu tháng này",
      icon: ArrowDownLeft,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/80 dark:border-emerald-500/20",
      amountColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Tổng Chi Tiêu",
      amount: monthlyExpense,
      subtext: "Chi tiêu đã ghi nhận",
      icon: ArrowUpRight,
      iconColor: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-50 dark:bg-rose-500/10 border-rose-200/80 dark:border-rose-500/20",
      amountColor: "text-rose-600 dark:text-rose-400",
    },
    {
      title: "Ngân Sách Còn Lại",
      amount: remainingBudget,
      subtext:
        typeof monthlyBudget === "number" && monthlyBudget > 0
          ? `Hạn mức: ${monthlyBudget.toLocaleString("vi-VN")} ₫`
          : "Chưa đặt hạn mức",
      icon: Target,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200/80 dark:border-amber-500/20",
      amountColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl border ${card.iconBg}`}>
                <Icon className={`w-4 h-4 ${card.iconColor}`} strokeWidth={2} />
              </div>
            </div>
            <div className={`text-2xl sm:text-[26px] font-extrabold tracking-tight ${card.amountColor} mb-1.5`}>
              {card.amount.toLocaleString("vi-VN")} ₫
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {card.subtext}
            </div>
          </div>
        );
      })}
    </div>
  );
}
