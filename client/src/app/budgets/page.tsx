"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { api, ApiBudget, ApiCategory, getErrorMessage, toNumber } from "@/services/api";

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
      setError(getErrorMessage(err, "Failed to load budgets"));
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
      setFormError(getErrorMessage(err, "Could not save the budget"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenAddModal={() => {}} onOpenOCRModal={() => {}} />
        <main className="flex-1 p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-100">Budget Management</h2>
              <p className="text-xs text-slate-400 mt-1">Configure spending limits per category for the current month</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30"
            >
              + Configure Budget
            </button>
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
            <div className="h-48 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-sm animate-pulse">
              Loading budgets...
            </div>
          ) : budgets.length === 0 ? (
            <div className="h-48 flex items-center justify-center rounded-2xl bg-slate-900 border border-dashed border-slate-800 text-slate-400 text-sm">
              No budgets configured for {currentMonth} yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgets.map((budget) => {
                const cap = toNumber(budget.amount_limit);
                const spent = toNumber(budget.spent_amount);
                const percentage = cap > 0 ? Math.min((spent / cap) * 100, 100) : 0;
                const isWarning = percentage >= 85;

                return (
                  <div key={budget.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${budget.category_color || "bg-blue-500"}`}></div>
                        <h4 className="font-bold text-base text-slate-100">
                          {budget.category_icon} {budget.category_name}
                        </h4>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isWarning
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                            : "bg-emerald-500/20 text-emerald-400"
                        }`}
                      >
                        {percentage.toFixed(0)}% Utilized
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline text-xs text-slate-400">
                      <span>
                        Spent: <b className="text-slate-100">{spent.toLocaleString("en-US")} ₫</b>
                      </span>
                      <span>
                        Cap: <b className="text-slate-200">{cap.toLocaleString("en-US")} ₫</b>
                      </span>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full ${isWarning ? "bg-rose-500" : budget.category_color || "bg-emerald-500"} transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Remaining: {Math.max(cap - spent, 0).toLocaleString("en-US")} ₫</span>
                      {isWarning && <span className="text-rose-400 font-semibold">⚠️ Nearing Limit</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Set Budget Modal */}
          {showModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
                <h3 className="text-lg font-bold text-slate-100 mb-4">Set Budget Cap</h3>
                <form onSubmit={handleSetBudget} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      {categories.length === 0 ? (
                        <option value="">No expense categories available</option>
                      ) : (
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Monthly Limit (VND)
                    </label>
                    <input
                      type="number"
                      required
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      placeholder="e.g. 3000000"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {formError && (
                    <div className="px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                      ⚠ {formError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="w-1/2 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving || categories.length === 0}
                      className="w-1/2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-xs font-bold text-slate-950"
                    >
                      {isSaving ? "Saving..." : "Save Budget"}
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
