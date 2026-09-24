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
      title: "Tổng số dư tài khoản",
      amount: totalBalance,
      subtext: "Trên 3 ví đang kết nối",
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
      title: "Tổng thu nhập tháng này",
      amount: monthlyIncome,
      subtext: "+12.5% so với tháng trước",
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
      title: "Tổng chi tiêu tháng này",
      amount: monthlyExpense,
      subtext: "48 giao dịch đã ghi nhận",
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
      title: "Ngân sách còn lại",
      amount: remainingBudget,
      subtext: "Hạn mức tháng 15,000,000 ₫",
      gradient: "from-amber-500/10 to-orange-500/5",
      borderColor: "border-amber-500/30",
      textColor: "text-amber-400",
      icon: (
        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 30a1 1 0 000 2h2a1 1 0 100-2h-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`p-5 rounded-2xl bg-gradient-to-br ${card.gradient} bg-slate-900 border ${card.borderColor} backdrop-blur-sm shadow-lg flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {card.title}
            </span>
            <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
              {card.icon}
            </div>
          </div>
          <div>
            <div className={`text-2xl font-extrabold tracking-tight ${card.textColor}`}>
              {card.amount.toLocaleString("vi-VN")} ₫
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">{card.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
