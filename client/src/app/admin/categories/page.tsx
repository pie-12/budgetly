"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import CategoryIcon from "@/components/common/CategoryIcon";
import {
  Search,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Tags,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  description: string;
  usageCount: number;
  isSystemDefault: boolean;
}

const initialCategories: Category[] = [
  { id: "CAT-01", name: "Food & Dining", type: "expense", description: "Meals, cafes, food delivery", usageCount: 14250, isSystemDefault: true },
  { id: "CAT-02", name: "Transport & Fuel", type: "expense", description: "Fuel, ride-hailing, taxi, maintenance", usageCount: 8900, isSystemDefault: true },
  { id: "CAT-03", name: "Income / Salary", type: "income", description: "Fixed monthly salary", usageCount: 5400, isSystemDefault: true },
  { id: "CAT-04", name: "Shopping & Fashion", type: "expense", description: "Shopee, Lazada, clothes, accessories", usageCount: 11200, isSystemDefault: true },
  { id: "CAT-05", name: "Entertainment & Travel", type: "expense", description: "Movies, travel tickets, games", usageCount: 4300, isSystemDefault: true },
  { id: "CAT-06", name: "Bills & Utilities", type: "expense", description: "Electricity, water, internet, apartment", usageCount: 3800, isSystemDefault: true },
  { id: "CAT-07", name: "Bonuses & Freelance", type: "income", description: "Side project income & bonuses", usageCount: 2100, isSystemDefault: true },
  { id: "CAT-08", name: "Investments & Crypto", type: "income", description: "Stocks, gold, savings interest", usageCount: 1950, isSystemDefault: false },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [description, setDescription] = useState("");

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newCat: Category = {
      id: `CAT-0${categories.length + 1}`,
      name,
      type,
      description,
      usageCount: 0,
      isSystemDefault: true,
    };

    setCategories([newCat, ...categories]);
    setIsModalOpen(false);
    setName("");
    setDescription("");
    showNotification(`Đã thêm danh mục hệ thống "${name}" thành công`);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    showNotification("Đã xóa danh mục khỏi hệ thống");
  };

  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 pb-12 font-sans transition-colors duration-200">
      <AdminHeader
        title="Quản Lý Danh Mục Thu Chi Hệ Thống"
        subtitle="Quản lý tập danh mục mặc định, định danh biểu tượng và phân loại cho người dùng"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-xl shadow-lg text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm danh mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="All">Tất cả loại (Thu & Chi)</option>
              <option value="expense">Khoản chi (Expense)</option>
              <option value="income">Khoản thu (Income)</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Danh Mục Mới</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-5 shadow-xs flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs">
                      <CategoryIcon
                        name={cat.name}
                        type={cat.type === "income" ? "INCOME" : "EXPENSE"}
                        className="w-5 h-5"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{cat.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mt-0.5 ${
                          cat.type === "income"
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                            : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                        }`}
                      >
                        {cat.type === "income" ? "Thu nhập" : "Chi tiêu"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px] line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-900 dark:text-slate-200">
                    {cat.usageCount.toLocaleString()}
                  </span>{" "}
                  lượt dùng
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Xóa danh mục"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add Category */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <Tags className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Thêm Danh Mục Hệ Thống
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              Danh mục này sẽ hiển thị làm mặc định cho tất cả người dùng
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tên Danh Mục
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Học phí & Giáo dục"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phân Loại
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "income" | "expense")}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="expense">Khoản chi (Expense)</option>
                  <option value="income">Khoản thu (Income)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mô Tả Danh Mục
                </label>
                <textarea
                  rows={2}
                  placeholder="Mô tả phạm vi chi tiêu của danh mục này..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-xs cursor-pointer active:scale-95"
                >
                  Lưu Danh Mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
