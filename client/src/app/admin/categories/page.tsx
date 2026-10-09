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
  { id: "CAT-01", name: "Ăn uống & Nhà hàng", type: "expense", icon: "🍲", color: "bg-amber-500", description: "Bữa ăn, quán cà phê, giao đồ ăn", usageCount: 14250, isSystemDefault: true },
  { id: "CAT-02", name: "Di chuyển & Xăng xe", type: "expense", icon: "🚗", color: "bg-blue-500", description: "Xăng máy, Grab, taxi, bảo dưỡng", usageCount: 8900, isSystemDefault: true },
  { id: "CAT-03", name: "Thu nhập / Lương", type: "income", icon: "💼", color: "bg-emerald-500", description: "Tiền lương cố định tháng", usageCount: 5400, isSystemDefault: true },
  { id: "CAT-04", name: "Mua sắm & Thời trang", type: "expense", icon: "🛍️", color: "bg-purple-500", description: "Shopee, Lazada, quần áo, phụ kiện", usageCount: 11200, isSystemDefault: true },
  { id: "CAT-05", name: "Giải trí & Du lịch", type: "expense", icon: "🎬", color: "bg-rose-500", description: "Xem phim, vé du lịch, game", usageCount: 4300, isSystemDefault: true },
  { id: "CAT-06", name: "Hóa đơn & Tiện ích", type: "expense", icon: "⚡", color: "bg-teal-500", description: "Điện, nước, internet, chung cư", usageCount: 3800, isSystemDefault: true },
  { id: "CAT-07", name: "Thưởng & Freelance", type: "income", icon: "🎁", color: "bg-yellow-500", description: "Thu nhập dự án phụ & tiền thưởng", usageCount: 2100, isSystemDefault: true },
  { id: "CAT-08", name: "Đầu tư & Crypto", type: "income", icon: "📈", color: "bg-indigo-500", description: "Cổ phiếu, vàng, lãi tiết kiệm", usageCount: 1950, isSystemDefault: false },
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
    showNotification(`Đã thêm thành công danh mục hệ thống "${name}"`);
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
    <div className="flex-1 pb-12">
      <AdminHeader
        title="🏷️ Quản Lý Danh Mục Thu Chi Mặc Định"
        subtitle="Quản lý bộ danh mục mẫu cho người dùng, biểu tượng và gán phân loại"
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
                placeholder="Tìm danh mục..."
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
              <option value="All">Tất cả loại (Thu & Chi)</option>
              <option value="expense">Khoản Chi (Expense)</option>
              <option value="income">Khoản Thu (Income)</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Danh Mục Mới</span>
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
                        {cat.type === "income" ? "Khoản Thu" : "Khoản Chi"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-400 min-h-[36px] line-clamp-2">{cat.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  <span className="font-mono font-bold text-slate-200">{cat.usageCount.toLocaleString()}</span> lượt dùng
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Thêm Danh Mục Hệ Thống Mới</h3>
            <p className="text-xs text-slate-400 mb-5">
              Danh mục này sẽ hiển thị làm mặc định cho toàn bộ người dùng app
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Danh Mục</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tiền Học Phí"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Loại Thu / Chi</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "income" | "expense")}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="expense">Khoản Chi (Expense)</option>
                  <option value="income">Khoản Thu (Income)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Emoji Biểu Tượng</label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Danh Mục</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả phạm vi áp dụng của danh mục này..."
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
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30"
                >
                  Tạo Danh Mục
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
