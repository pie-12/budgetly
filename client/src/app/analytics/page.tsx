"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { api, ApiAnalyticsSummary, getErrorMessage, toNumber } from "@/services/api";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<ApiAnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getSummary();
      setSummary(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load analytics"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const monthlyIncome = toNumber(summary?.monthly_income);
  const monthlyExpense = toNumber(summary?.monthly_expense);
  const netCashflow = monthlyIncome - monthlyExpense;
  const breakdown = summary?.category_breakdown ?? [];
  const maxCategoryAmount =
    breakdown.reduce((max, item) => Math.max(max, toNumber(item.amount)), 0) || 1;
  const cashflowTotal = monthlyIncome + monthlyExpense || 1;

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenAddModal={() => {}} onOpenOCRModal={() => {}} />
        <main className="flex-1 p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Financial Reports & Analytics</h2>
            <p className="text-xs text-slate-400 mt-1">Visualize category weight distribution and net cash flow trends</p>
          </div>

          {error && (
            <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              <span>⚠ {error}</span>
              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 font-semibold hover:bg-rose-500/30 transition-all"
              >
                Retry
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="h-64 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-sm animate-pulse">
              Loading analytics...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expense allocation by category */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
                <h3 className="font-bold text-slate-200 text-sm">Expense Allocation by Category</h3>
                {breakdown.length === 0 ? (
                  <div className="h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                    No expense data recorded yet
                  </div>
                ) : (
                  <div className="space-y-4">
                    {breakdown.map((item) => {
                      const amount = toNumber(item.amount);
                      return (
                        <div key={item.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-200">
                              {item.icon} {item.name}
                            </span>
                            <span className="text-slate-400">
                              {amount.toLocaleString("en-US")} ₫
                              <b className="text-slate-200 ml-2">{item.percentage}%</b>
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full ${item.color || "bg-blue-500"} transition-all duration-300`}
                              style={{ width: `${(amount / maxCategoryAmount) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Income vs expense */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
                <h3 className="font-bold text-slate-200 text-sm">Income vs. Expense Trend</h3>
                <div className="space-y-5 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-400">Monthly Income</span>
                      <span className="text-slate-200 font-bold">
                        {monthlyIncome.toLocaleString("en-US")} ₫
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${(monthlyIncome / cashflowTotal) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-rose-400">Monthly Expenses</span>
                      <span className="text-slate-200 font-bold">
                        {monthlyExpense.toLocaleString("en-US")} ₫
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 transition-all duration-300"
                        style={{ width: `${(monthlyExpense / cashflowTotal) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Net Cash Flow</span>
                    <span className={`font-black text-lg ${netCashflow >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {netCashflow >= 0 ? "+" : "−"}
                      {Math.abs(netCashflow).toLocaleString("en-US")} ₫
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
