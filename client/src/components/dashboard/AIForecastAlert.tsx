"use client";

import { AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";

interface AIForecastAlertProps {
  monthlyExpense: number;
  monthlyBudget: number;
}

export default function AIForecastAlert({ monthlyExpense, monthlyBudget }: AIForecastAlertProps) {
  const daysInMonth = 30;
  const currentDay = 15;
  const avgDailySpend = monthlyExpense / currentDay;
  const projectedTotal = monthlyExpense + avgDailySpend * (daysInMonth - currentDay);
  const safeBudget = monthlyBudget > 0 ? monthlyBudget : 0;
  const percentUsed = safeBudget > 0 ? (monthlyExpense / safeBudget) * 100 : 0;
  const isOverBudgetRisk = safeBudget > 0 && projectedTotal > safeBudget * 0.9;

  return (
    <div
      className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-200 ${
        isOverBudgetRisk
          ? "bg-gradient-to-r from-rose-50/70 via-white to-white dark:from-rose-950/30 dark:via-slate-900 dark:to-slate-900 border-rose-200 dark:border-rose-500/30 shadow-xs"
          : "bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800 shadow-xs"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
              isOverBudgetRisk
                ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30"
                : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
            }`}
          >
            {isOverBudgetRisk ? (
              <AlertTriangle className="w-5 h-5 animate-pulse" strokeWidth={2} />
            ) : (
              <TrendingUp className="w-5 h-5" strokeWidth={2} />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                Dự Báo & Cảnh Báo Ngân Sách AI
              </h4>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  isOverBudgetRisk
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30"
                }`}
              >
                {isOverBudgetRisk ? "Nguy Cơ Cao" : "Đúng Kế Hoạch"}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              {isOverBudgetRisk ? (
                <>
                  Tốc độ chi tiêu trung bình hiện tại (~
                  <strong className="text-rose-600 dark:text-rose-400 font-semibold">
                    {avgDailySpend.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫/ngày
                  </strong>
                  ), AI ước tính cuối tháng chi tiêu sẽ đạt{" "}
                  <strong className="text-rose-600 dark:text-rose-400 font-semibold">
                    {projectedTotal.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫
                  </strong>{" "}
                  (Vượt ngân sách {(projectedTotal - monthlyBudget).toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫). Hãy cân nhắc cắt giảm chi tiêu không thiết yếu!
                </>
              ) : (
                <>
                  Mức chi tiêu trung bình đang ở mức{" "}
                  <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    {avgDailySpend.toLocaleString("vi-VN", { maximumFractionDigits: 0 })} ₫/ngày
                  </strong>
                  . Dự báo cuối tháng nằm trong giới hạn an toàn của ngân sách ({monthlyBudget.toLocaleString("vi-VN")} ₫).
                </>
              )}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right shrink-0 pl-13 sm:pl-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Tiến độ chi tiêu</span>
          <span className={`text-xl font-black ${isOverBudgetRisk ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
            {percentUsed.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
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
