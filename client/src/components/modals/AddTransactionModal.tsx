"use client";

import { useEffect, useState } from "react";
import {
  api,
  ApiCategory,
  ApiWallet,
  getErrorMessage,
  TransactionPayload,
} from "@/services/api";
import { X, Plus, AlertCircle, Loader2 } from "lucide-react";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  wallets: ApiWallet[];
  categories: ApiCategory[];
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onCreated,
  wallets,
  categories,
}: AddTransactionModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [walletId, setWalletId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletId && wallets.length > 0) {
      setWalletId(wallets[0].id);
    }
  }, [walletId, wallets]);

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      const preferred = categories.find(
        (category) => category.type === (type === "income" ? "INCOME" : "EXPENSE")
      );
      setCategoryId(preferred?.id ?? categories[0].id);
    }
  }, [categoryId, categories, type]);

  if (!isOpen) return null;

  const handleTypeChange = (nextType: "expense" | "income") => {
    setType(nextType);
    const preferred = categories.find(
      (category) => category.type === (nextType === "income" ? "INCOME" : "EXPENSE")
    );
    setCategoryId(preferred?.id ?? "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || !walletId) return;

    setIsSaving(true);
    setError(null);
    try {
      const payload: TransactionPayload = {
        wallet_id: walletId,
        category_id: categoryId || null,
        amount: parseFloat(amount),
        transaction_type: type === "income" ? "INCOME" : "EXPENSE",
        description: description.trim(),
        transaction_date: `${date}T00:00:00`,
        input_method: "MANUAL",
      };
      await api.createTransaction(payload);
      setDescription("");
      setAmount("");
      onCreated?.();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Không thể lưu giao dịch"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative transition-colors duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
            <span>Thêm Giao Dịch Mới</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Transaction Type Buttons */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                type === "expense"
                  ? "bg-rose-500 text-white shadow-xs shadow-rose-500/25"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Khoản Chi (Expense)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                type === "income"
                  ? "bg-emerald-600 text-white shadow-xs shadow-emerald-600/25"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              Khoản Thu (Income)
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Số Tiền (VNĐ)
            </label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Ví dụ: 50000"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Nội Dung Giao Dịch
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ví dụ: Cà phê sáng với bạn bè"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Category & Wallet Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Danh Mục
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
              >
                {categories.length === 0 ? (
                  <option value="">Không có danh mục</option>
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
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Ví Thanh Toán
              </label>
              <select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
              >
                {wallets.length === 0 ? (
                  <option value="">Không có ví</option>
                ) : (
                  wallets.map((wallet) => (
                    <option key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Ngày Giao Dịch
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {error && (
            <div className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.8} />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving || wallets.length === 0}
              className="w-1/2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-xs font-bold text-white transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                "Lưu Giao Dịch"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
