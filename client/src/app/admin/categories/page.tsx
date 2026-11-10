"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import CategoryIcon from "@/components/common/CategoryIcon";
import { useLanguage } from "@/context/LanguageContext";
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
  name_vi: string;
  name_en: string;
  type: "income" | "expense";
  description_vi: string;
  description_en: string;
  usageCount: number;
  isSystemDefault: boolean;
}

const initialCategories: Category[] = [
  {
    id: "CAT-01",
    name_vi: "Ăn uống & nhà hàng",
    name_en: "Food & Dining",
    type: "expense",
    description_vi: "Bữa ăn, cà phê, nhà hàng và dịch vụ giao đồ ăn tận nơi",
    description_en: "Meals, cafes, restaurants, and food delivery services",
    usageCount: 14250,
    isSystemDefault: true,
  },
  {
    id: "CAT-02",
    name_vi: "Di chuyển & xăng xe",
    name_en: "Transport & Fuel",
    type: "expense",
    description_vi: "Xăng dầu, xe ôm công nghệ, taxi, vé xe buýt và bảo dưỡng",
    description_en: "Fuel, ride-hailing, taxi, bus fares, and vehicle maintenance",
    usageCount: 8900,
    isSystemDefault: true,
  },
  {
    id: "CAT-03",
    name_vi: "Lương & thu nhập cố định",
    name_en: "Income / Salary",
    type: "income",
    description_vi: "Tiền lương hàng tháng, phụ cấp và các khoản thu nhập chính",
    description_en: "Fixed monthly salary, allowances, and primary income",
    usageCount: 5400,
    isSystemDefault: true,
  },
  {
    id: "CAT-04",
    name_vi: "Mua sắm & thời trang",
    name_en: "Shopping & Fashion",
    type: "expense",
    description_vi: "Mua sắm trực tuyến, quần áo, phụ kiện và đồ dùng cá nhân",
    description_en: "Online shopping, clothing, accessories, and personal items",
    usageCount: 11200,
    isSystemDefault: true,
  },
  {
    id: "CAT-05",
    name_vi: "Giải trí & du lịch",
    name_en: "Entertainment & Travel",
    type: "expense",
    description_vi: "Xem phim, vé du lịch, khách sạn, trò chơi và sở thích cá nhân",
    description_en: "Movies, travel tickets, hotels, gaming, and personal hobbies",
    usageCount: 4300,
    isSystemDefault: true,
  },
  {
    id: "CAT-06",
    name_vi: "Hóa đơn & tiện ích",
    name_en: "Bills & Utilities",
    type: "expense",
    description_vi: "Hóa đơn điện thoại, tiền điện, nước, internet và phí quản lý",
    description_en: "Phone bills, electricity, water, internet, and building fees",
    usageCount: 3800,
    isSystemDefault: true,
  },
  {
    id: "CAT-07",
    name_vi: "Thưởng & việc tự do",
    name_en: "Bonuses & Freelance",
    type: "income",
    description_vi: "Thu nhập ngoài giờ, dự án freelance và tiền thưởng hiệu suất",
    description_en: "Overtime income, freelance contracts, and performance bonuses",
    usageCount: 2100,
    isSystemDefault: true,
  },
  {
    id: "CAT-08",
    name_vi: "Đầu tư & tích lũy",
    name_en: "Investments & Crypto",
    type: "income",
    description_vi: "Lợi nhuận cổ phiếu, quỹ tài chính, tiền mã hóa và lãi tiết kiệm",
    description_en: "Stock returns, mutual funds, crypto, and savings interest",
    usageCount: 1950,
    isSystemDefault: false,
  },
];

export default function AdminCategoriesPage() {
  const { t, language } = useLanguage();
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
      name_vi: name,
      name_en: name,
      type,
      description_vi: description || (language === "vi" ? "Danh mục do quản trị viên tạo" : "Custom admin category"),
      description_en: description || "Custom admin category",
      usageCount: 0,
      isSystemDefault: true,
    };

    setCategories([newCat, ...categories]);
    setIsModalOpen(false);
    setName("");
    setDescription("");
    showNotification(language === "vi" ? `Đã thêm danh mục hệ thống "${name}" thành công` : `Added category "${name}" successfully`);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
    showNotification(language === "vi" ? "Đã xóa danh mục khỏi hệ thống" : "Deleted category from system");
  };

  const filteredCategories = categories.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.name_vi.toLowerCase().includes(q) ||
      c.name_en.toLowerCase().includes(q) ||
      c.description_vi.toLowerCase().includes(q) ||
      c.description_en.toLowerCase().includes(q);
    const matchesType = typeFilter === "All" || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex-1 pb-12 font-sans transition-colors duration-200">
      <AdminHeader
        title={language === "vi" ? "Quản lý danh mục thu chi hệ thống" : "System Categories Management"}
        subtitle={
          language === "vi"
            ? "Quản lý tập danh mục mặc định, định danh biểu tượng và phân loại cho người dùng"
            : "Manage default categories, icons, and classification for users"
        }
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
                placeholder={language === "vi" ? "Tìm kiếm danh mục..." : "Search categories..."}
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
              <option value="All">{language === "vi" ? "Tất cả loại (Thu & chi)" : "All types (Income & Expense)"}</option>
              <option value="expense">{language === "vi" ? "Khoản chi" : "Expense"}</option>
              <option value="income">{language === "vi" ? "Khoản thu" : "Income"}</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all shrink-0 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === "vi" ? "Thêm danh mục mới" : "Add New Category"}</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCategories.map((cat) => {
            const catName = language === "vi" ? cat.name_vi : cat.name_en;
            const catDesc = language === "vi" ? cat.description_vi : cat.description_en;

            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-5 shadow-xs flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-xs">
                        <CategoryIcon
                          name={cat.name_vi}
                          type={cat.type === "income" ? "INCOME" : "EXPENSE"}
                          className="w-5 h-5"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{catName}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block mt-0.5 ${
                            cat.type === "income"
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                              : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                          }`}
                        >
                          {cat.type === "income"
                            ? (language === "vi" ? "Khoản thu" : "Income")
                            : (language === "vi" ? "Khoản chi" : "Expense")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 min-h-[36px] line-clamp-2">
                    {catDesc}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-bold text-slate-900 dark:text-slate-200">
                      {cat.usageCount.toLocaleString()}
                    </span>{" "}
                    {language === "vi" ? "lượt dùng" : "uses"}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title={language === "vi" ? "Xóa danh mục" : "Delete category"}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
                {language === "vi" ? "Thêm danh mục hệ thống" : "Add System Category"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              {language === "vi" ? "Danh mục này sẽ hiển thị làm mặc định cho tất cả người dùng" : "This category will be set as default for all users"}
            </p>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi" ? "Tên danh mục" : "Category Name"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === "vi" ? "Ví dụ: Học phí & giáo dục" : "e.g. Tuition & Education"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi" ? "Phân loại" : "Type"}
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "income" | "expense")}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="expense">{language === "vi" ? "Khoản chi" : "Expense"}</option>
                  <option value="income">{language === "vi" ? "Khoản thu" : "Income"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi" ? "Mô tả danh mục" : "Description"}
                </label>
                <textarea
                  rows={2}
                  placeholder={language === "vi" ? "Mô tả phạm vi chi tiêu của danh mục này..." : "Describe this category..."}
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
                  {language === "vi" ? "Hủy" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-xs cursor-pointer active:scale-95"
                >
                  {language === "vi" ? "Lưu danh mục" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
