"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import CategoryIcon from "@/components/common/CategoryIcon";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import OCRScanModal from "@/components/modals/OCRScanModal";
import {
  api,
  ApiAnalyticsSummary,
  ApiCategory,
  ApiWallet,
  getErrorMessage,
  toNumber,
} from "@/services/api";
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  PieChart,
  BarChart3,
  AlertCircle,
  RefreshCw,
  Loader2,
  Calendar,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<ApiAnalyticsSummary | null>(null);
  const [wallets, setWallets] = useState<ApiWallet[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [summaryRes, walletsRes, categoriesRes] = await Promise.all([
        api.getSummary(),
        api.getWallets(),
        api.getCategories(),
      ]);
      setSummary(summaryRes.data);
      setWallets(walletsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải dữ liệu báo cáo phân tích"));
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
  const savingsRate =
    monthlyIncome > 0 ? Math.max(0, Math.round((netCashflow / monthlyIncome) * 100)) : 0;

  const currentMonthYear = new Intl.DateTimeFormat("vi-VN", {
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenOCRModal={() => setIsOCRModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Header Title Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  Báo Cáo & Phân Tích
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                  <Sparkles className="w-3 h-3" />
                  AI Insights
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Theo dõi cơ cấu chi tiêu, đối chiếu dòng tiền thu - chi và tỷ lệ tiết kiệm
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs text-xs font-medium text-slate-700 dark:text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize">{currentMonthYear}</span>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-700 dark:text-rose-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" strokeWidth={2} />
                <span>{error}</span>
              </div>
              <button
                onClick={loadData}
                className="px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-500/20 border border-rose-300 dark:border-rose-500/40 font-bold hover:bg-rose-200 dark:hover:bg-rose-500/30 transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="h-72 flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm gap-2 animate-pulse">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span>Đang tính toán dữ liệu phân tích...</span>
            </div>
          ) : (
            <>
              {/* KPI Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Monthly Income Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Tổng Thu Nhập
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <ArrowDownLeft className="w-4 h-4" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      {monthlyIncome.toLocaleString("vi-VN")} ₫
                    </div>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                      Ghi nhận trong tháng
                    </span>
                  </div>
                </div>

                {/* Monthly Expense Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Tổng Chi Tiêu
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-400">
                      <ArrowUpRight className="w-4 h-4" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      {monthlyExpense.toLocaleString("vi-VN")} ₫
                    </div>
                    <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                      Tổng đã giải ngân
                    </span>
                  </div>
                </div>

                {/* Net Cash Flow Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Dòng Tiền Thuần
                    </span>
                    <div
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                        netCashflow >= 0
                          ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      <Wallet className="w-4 h-4" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div
                      className={`text-xl font-bold tracking-tight ${
                        netCashflow >= 0
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {netCashflow >= 0 ? "+" : "−"}
                      {Math.abs(netCashflow).toLocaleString("vi-VN")} ₫
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {netCashflow >= 0 ? "Thặng dư tài chính" : "Thâm hụt dòng tiền"}
                    </span>
                  </div>
                </div>

                {/* Savings Rate Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Tỷ Lệ Tiết Kiệm
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <PieChart className="w-4 h-4" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      {savingsRate}%
                    </div>
                    <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      Mục tiêu tối thiểu 20%
                    </span>
                  </div>
                </div>
              </div>

              {/* Main 2-Column Analytics Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Expense Allocation by Category */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <PieChart className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        Cơ Cấu Chi Tiêu Theo Danh Mục
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {breakdown.length} Danh mục
                    </span>
                  </div>

                  {breakdown.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 text-xs gap-2">
                      <BarChart3 className="w-8 h-8 opacity-40" strokeWidth={1.5} />
                      <span>Chưa có dữ liệu chi tiêu ghi nhận trong kỳ</span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {breakdown.map((item) => {
                        const amount = toNumber(item.amount);
                        const percent = item.percentage;
                        return (
                          <div key={item.name} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 shrink-0">
                                  <CategoryIcon
                                    name={item.name}
                                    type="EXPENSE"
                                    className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300"
                                  />
                                </div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {item.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 dark:text-slate-400 font-medium">
                                  {amount.toLocaleString("vi-VN")} ₫
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                  {percent}%
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full transition-all duration-500"
                                style={{ width: `${(amount / maxCategoryAmount) * 100}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Income vs. Expense Trend */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-6 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <BarChart3 className="w-4 h-4" strokeWidth={2} />
                      </div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        Đối Ứng Thu Nhập & Chi Tiêu
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      Tỷ lệ cân đối
                    </span>
                  </div>

                  <div className="space-y-5 pt-1">
                    {/* Income Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <ArrowDownLeft className="w-3.5 h-3.5" />
                          Thu Nhập Trong Tháng
                        </span>
                        <span className="text-slate-900 dark:text-slate-100 font-bold">
                          {monthlyIncome.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${cashflowTotal > 0 ? (monthlyIncome / cashflowTotal) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Expense Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          Chi Tiêu Trong Tháng
                        </span>
                        <span className="text-slate-900 dark:text-slate-100 font-bold">
                          {monthlyExpense.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5">
                        <div
                          className="h-full bg-rose-500 rounded-full transition-all duration-500"
                          style={{
                            width: `${cashflowTotal > 0 ? (monthlyExpense / cashflowTotal) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Financial Summary Card */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Số Dư Dòng Tiền Ròng
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{netCashflow >= 0 ? "Dòng tiền dương ổn định" : "Cần hạn chế chi tiêu vượt mức"}</span>
                          </div>
                        </div>
                        <span
                          className={`font-black text-lg ${
                            netCashflow >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {netCashflow >= 0 ? "+" : "−"}
                          {Math.abs(netCashflow).toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={loadData}
        wallets={wallets}
        categories={categories}
      />
      <OCRScanModal
        isOpen={isOCRModalOpen}
        onClose={() => setIsOCRModalOpen(false)}
        onCreated={loadData}
        wallets={wallets}
        categories={categories}
      />
    </div>
  );
}
