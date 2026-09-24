"use client";

interface AIForecastAlertProps {
  monthlyExpense: number;
  monthlyBudget: number;
}

export default function AIForecastAlert({ monthlyExpense, monthlyBudget }: AIForecastAlertProps) {
  // Simple AI forecast calculation logic (FR-10 spec)
  const daysInMonth = 30;
  const currentDay = 15; // Mid month simulation
  const avgDailySpend = monthlyExpense / currentDay;
  const projectedTotal = monthlyExpense + avgDailySpend * (daysInMonth - currentDay);
  const percentUsed = (monthlyExpense / monthlyBudget) * 100;
  const isOverBudgetRisk = projectedTotal > monthlyBudget * 0.9;

  return (
    <div
      className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${
        isOverBudgetRisk
          ? "bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border-rose-500/40 shadow-rose-900/10 shadow-lg"
          : "bg-slate-900/90 border-slate-800"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg border ${
              isOverBudgetRisk
                ? "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse"
                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
            }`}
          >
            {isOverBudgetRisk ? "⚠️" : "📊"}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-100 text-sm">
                AI Spending Forecast & Alerts (Dự báo chi tiêu AI)
              </h4>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  isOverBudgetRisk
                    ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                    : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                }`}
              >
                {isOverBudgetRisk ? "Cảnh báo cao" : "Tiến trình ổn định"}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {isOverBudgetRisk ? (
                <>
                  Với tốc độ chi tiêu hiện tại (~
                  <strong className="text-rose-400">{avgDailySpend.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫/ngày</strong>
                  ), AI dự báo tổng chi tiêu cuối tháng sẽ đạt{" "}
                  <strong className="text-rose-400">{projectedTotal.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫</strong> (Vượt ngân sách{" "}
                  {(projectedTotal - monthlyBudget).toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫). Hãy tiết kiệm thêm trong 2 tuần tới!
                </>
              ) : (
                <>
                  Tốc độ chi tiêu trung bình của bạn ở mức{" "}
                  <strong className="text-emerald-400">{avgDailySpend.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫/ngày</strong>. Dự báo cuối tháng tổng chi tiêu nằm trong hạn mức an toàn ({monthlyBudget.toLocaleString("vi-VN")} ₫).
                </>
              )}
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs text-slate-400 block font-medium">Tiến trình ngân sách</span>
          <span className={`text-lg font-extrabold ${isOverBudgetRisk ? "text-rose-400" : "text-emerald-400"}`}>
            {percentUsed.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full h-2 rounded-full bg-slate-800 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-500 ${
            isOverBudgetRisk
              ? "bg-gradient-to-r from-amber-500 to-rose-500"
              : "bg-gradient-to-r from-emerald-500 to-teal-400"
          }`}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
