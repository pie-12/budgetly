"use client";

interface SummaryCardsProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  remainingBudget: number;
}

export default function SummaryCards({
  totalBalance,
  monthlyIncome,
  monthlyExpense,
  remainingBudget,
}: SummaryCardsProps) {
  const cards = [
    {
      title: "Total Balance",
      amount: totalBalance,
      subtext: "Across 3 connected wallets",
      gradient: "from-emerald-500/10 to-teal-500/5",
      borderColor: "border-emerald-500/30",
      textColor: "text-emerald-400",
      icon: (
        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Monthly Income",
      amount: monthlyIncome,
      subtext: "+12.5% vs last month",
      gradient: "from-blue-500/10 to-indigo-500/5",
      borderColor: "border-blue-500/30",
      textColor: "text-blue-400",
      icon: (
        <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
    },
    {
      title: "Monthly Expenses",
      amount: monthlyExpense,
      subtext: "48 tracked transactions",
      gradient: "from-rose-500/10 to-pink-500/5",
      borderColor: "border-rose-500/30",
      textColor: "text-rose-400",
      icon: (
        <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
    },
    {
      title: "Remaining Budget",
      amount: remainingBudget,
      subtext: "Monthly limit: $15,000,000",
      gradient: "from-amber-500/10 to-orange-500/5",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-5 rounded-2xl bg-gradient-to-br ${card.gradient} bg-slate-900/60 border ${card.borderColor} backdrop-blur-sm transition-all hover:translate-y-[-2px] hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {card.title}
            </span>
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              {card.icon}
            </div>
          </div>
          <div className={`text-2xl font-black tracking-tight ${card.textColor} mb-1`}>
            {card.amount.toLocaleString("vi-VN")} ₫
          </div>
          <div className="text-xs text-slate-400 font-medium">
            {card.subtext}
          </div>
        </div>
      ))}
    </div>
  );
}
