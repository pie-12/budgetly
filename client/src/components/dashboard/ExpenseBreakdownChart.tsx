"use client";

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
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
            <span>Expense Breakdown</span>
            <span className="text-xs font-normal text-slate-400">(By Category)</span>
          </h3>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            Sep 2026
          </span>
        </div>

        {/* Visual Multi-color Progress Stack Bar */}
        <div className="w-full h-3 rounded-full bg-slate-800 flex overflow-hidden mb-6">
          {categories.map((cat, idx) => {
            const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
            return (
              <div
                key={idx}
                className={`h-full ${cat.color} transition-all duration-300`}
                style={{ width: `${percentage}%` }}
                title={`${cat.name}: ${cat.amount.toLocaleString("en-US")} ₫ (${percentage.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        {/* Category List Details */}
        <div className="space-y-3.5">
          {categories.map((cat, idx) => {
            const percentage = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${cat.color} bg-opacity-20 flex items-center justify-center text-sm`}>
                    {cat.icon}
                  </div>
                  <span className="font-semibold text-slate-200">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-medium">
                    {percentage.toFixed(1)}%
                  </span>
                  <span className="font-bold text-slate-100 min-w-[70px] text-right">
                    {cat.amount.toLocaleString("en-US")} ₫
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Total Tracked Expenses</span>
        <span className="font-bold text-slate-200 text-sm">{totalExpense.toLocaleString("en-US")} ₫</span>
      </div>
    </div>
  );
}
