"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  FolderKanban,
  Plus,
  Search,
  CheckCircle2,
  Edit,
  Trash2,
  X,
  TrendingDown,
  TrendingUp,
  Tag,
  PieChart,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  description: string;
  usageCount: number;
  isSystemDefault: boolean;
}

const initialCategories: Category[] = [
  { id: "CAT-01", name: "Food & Dining", type: "expense", icon: "🍲", color: "bg-amber-500", description: "Meals, cafes, food delivery", usageCount: 14250, isSystemDefault: true },
  { id: "CAT-02", name: "Transport & Fuel", type: "expense", icon: "🚗", color: "bg-blue-500", description: "Fuel, ride-hailing, taxi, maintenance", usageCount: 8900, isSystemDefault: true },
  { id: "CAT-03", name: "Income / Salary", type: "income", icon: "💼", color: "bg-emerald-500", description: "Fixed monthly salary", usageCount: 5400, isSystemDefault: true },
  { id: "CAT-04", name: "Shopping & Fashion", type: "expense", icon: "🛍️", color: "bg-purple-500", description: "Shopee, Lazada, clothes, accessories", usageCount: 11200, isSystemDefault: true },
  { id: "CAT-05", name: "Entertainment & Travel", type: "expense", icon: "🎬", color: "bg-rose-500", description: "Movies, travel tickets, games", usageCount: 4300, isSystemDefault: true },
  { id: "CAT-06", name: "Bills & Utilities", type: "expense", icon: "⚡", color: "bg-teal-500", description: "Electricity, water, internet, apartment", usageCount: 3800, isSystemDefault: true },
  { id: "CAT-07", name: "Bonuses & Freelance", type: "income", icon: "🎁", color: "bg-yellow-500", description: "Side project income & bonuses", usageCount: 2100, isSystemDefault: true },
  { id: "CAT-08", name: "Investments & Crypto", type: "income", icon: "📈", color: "bg-indigo-500", description: "Stocks, gold, savings interest", usageCount: 1950, isSystemDefault: false },
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
  const [icon, setIcon] = useState("🏷️");
  const [color, setColor] = useState("bg-indigo-500");
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
      icon,
      color,
      description,
      usageCount: 0,
      isSystemDefault: true,
    };

    setCategories([newCat, ...categories]);
    setIsModalOpen(false);
    setName("");
    setDescription("");
    showNotification(`System category "${name}" added successfully`);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    showNotification("Category deleted from the system");
  };

  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="🏷️ Default Income & Expense Category Management"
        subtitle="Manage the default category set, icons, and classification for users"
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-2xl text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All types (Income & Expense)</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-2xl ${cat.color} text-2xl flex items-center justify-center shadow-lg`}
                    >
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{cat.name}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mt-0.5 ${
                          cat.type === "income"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                        }`}
                      >
                        {cat.type === "income" ? "Income" : "Expense"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 min-h-[36px] line-clamp-2">{cat.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  <span className="font-mono font-bold text-slate-200">{cat.usageCount.toLocaleString()}</span> uses
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete category"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Add New System Category</h3>
            <p className="text-xs text-slate-400 mb-5">
              This category will be shown as a default for all app users
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tuition Fees"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Type (Income / Expense)</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "income" | "expense")}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Emoji Icon</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe the scope of this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
