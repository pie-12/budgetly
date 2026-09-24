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
            <span>Phân bổ chi tiêu</span>
            <span className="text-xs font-normal text-slate-400">(Theo Danh mục)</span>
          </h3>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            Tháng 9/2026
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
                title={`${cat.name}: ${cat.amount.toLocaleString("vi-VN")} ₫ (${percentage.toFixed(1)}%)`}
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
                  <span className="font-bold text-slate-100 min-w-[90px] text-right">
                    {cat.amount.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <span>Tổng chi danh mục:</span>
        <strong className="text-slate-200 font-bold text-sm">
          {totalExpense.toLocaleString("vi-VN")} ₫
        </strong>
      </div>
    </div>
  );
}
