"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import CategoryIcon from "@/components/common/CategoryIcon";
import { api, ApiBudget, ApiCategory, getErrorMessage, toNumber } from "@/services/api";
import { Target, Plus, AlertCircle, RefreshCw, X, Loader2, AlertTriangle } from "lucide-react";

const currentMonth = new Date().toISOString().slice(0, 7);

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<ApiBudget[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [limit, setLimit] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [budgetsRes, categoriesRes] = await Promise.all([
        api.getBudgets(),
        api.getCategories(),
      ]);
      setBudgets(budgetsRes.data);
      setCategories(categoriesRes.data.filter((category) => category.type === "EXPENSE"));
    } catch (err) {
      setError(getErrorMessage(err, "Không thể tải danh sách ngân sách"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categoryId, categories]);

  const handleSetBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!limit || !categoryId) return;

    setIsSaving(true);
    setFormError(null);
    try {
      await api.saveBudget({
        category_id: categoryId,
        amount_limit: parseFloat(limit),
        month_year: currentMonth,
      });
      setShowModal(false);
      setLimit("");
      loadData();
    } catch (err) {
      setFormError(getErrorMessage(err, "Không thể lưu hạn mức ngân sách"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenAddModal={() => {}} onOpenOCRModal={() => {}} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                Quản Lý Ngân Sách
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Thiết lập hạn mức chi tiêu cho từng danh mục trong tháng hiện tại
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Thiết Lập Ngân Sách</span>
            </button>
          </div>

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

          {isLoading ? (
            <div className="h-48 flex flex-col items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm gap-2 animate-pulse">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600 dark:text-emerald-400" />
              <span>Đang tải danh sách ngân sách...</span>
            </div>
          ) : budgets.length === 0 ? (
            <div className="h-48 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
              Chưa có ngân sách nào được thiết lập cho tháng {currentMonth}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {budgets.map((budget) => {
                const cap = toNumber(budget.amount_limit);
                const spent = toNumber(budget.spent_amount);
                const percentage = cap > 0 ? Math.min((spent / cap) * 100, 100) : 0;
                const isWarning = percentage >= 85;

                return (
                  <div key={budget.id} className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <CategoryIcon name={budget.category_name} icon={budget.category_icon} className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                          {budget.category_name}
                        </h4>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                          isWarning
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30"
                            : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30"
                        }`}
                      >
                        {percentage.toFixed(0)}% Đã dùng
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span>
                        Đã chi: <b className="text-slate-900 dark:text-slate-100">{spent.toLocaleString("vi-VN")} ₫</b>
                      </span>
                      <span>
                        Hạn mức: <b className="text-slate-700 dark:text-slate-300">{cap.toLocaleString("vi-VN")} ₫</b>
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full ${isWarning ? "bg-rose-500" : "bg-emerald-500"} transition-all duration-300 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                      <span>Còn lại: <strong className="text-slate-700 dark:text-slate-300 font-mono">{Math.max(cap - spent, 0).toLocaleString("vi-VN")} ₫</strong></span>
                      {isWarning && (
                        <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Sắp chạm hạn mức
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Set Budget Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
              <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative shadow-2xl transition-colors duration-200">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-200/80 dark:border-slate-800 mb-4">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span>Thiết Lập Hạn Mức Ngân Sách</span>
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleSetBudget} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Danh Mục Chi Tiêu
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      {categories.length === 0 ? (
                        <option value="">Không có danh mục chi tiêu</option>
                      ) : (
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Hạn Mức Hàng Tháng (VNĐ)
                    </label>
                    <input
                      type="number"
                      required
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      placeholder="Ví dụ: 3000000"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  {formError && (
                    <div className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || categories.length === 0}
                      className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-xs font-bold text-white shadow-xs flex items-center justify-center gap-1.5"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        "Lưu Ngân Sách"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
