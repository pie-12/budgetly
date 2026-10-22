"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import OCRScanModal from "@/components/modals/OCRScanModal";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  User,
  Moon,
  Sun,
  Sparkles,
  Bell,
  Shield,
  Save,
  Check,
  Sliders,
  LogOut,
  Mail,
  Palette,
  Bot,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [fullName, setFullName] = useState(user?.full_name || "Nguyễn Tùng Lâm");
  const [email] = useState(user?.email || "lam23it138@budgetly.io");
  const [nlpEnabled, setNlpEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [ocrAutoTag, setOcrAutoTag] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenOCRModal={() => setIsOCRModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Cài Đặt Hệ Thống & Hồ Sơ
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Quản lý thông tin tài khoản cá nhân, tùy biến giao diện và cấu hình trợ lý AI
            </p>
          </div>

          <div className="max-w-3xl space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* User Profile Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs transition-colors duration-200">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <User className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    Thông Tin Tài Khoản
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Họ và Tên
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="Nhập họ và tên..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Địa Chỉ Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme & Appearance Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs transition-colors duration-200">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200/60 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Palette className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Giao Diện & Chế Độ Màu
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Tùy chọn phong cách hiển thị ứng dụng phù hợp với môi trường làm việc
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Light Mode Button */}
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                      theme === "light"
                        ? "bg-emerald-50/50 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Chế độ Sáng (Light)</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Sạch sẽ, dịu mắt ban ngày</div>
                    </div>
                  </button>

                  {/* Dark Mode Button */}
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all ${
                      theme === "dark"
                        ? "bg-slate-800/80 border-emerald-500 text-slate-100 ring-2 ring-emerald-500/20"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Chế độ Tối (Dark)</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Fintech hiện đại, tập trung cao</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* AI & Automation Configuration */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs transition-colors duration-200">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Bot className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      Cấu Hình Trợ Lý AI & Tự Động Hóa
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Thiết lập các tính năng xử lý ngôn ngữ tự nhiên và phát hiện rủi ro chi tiêu
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/70">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          Phân Tích Tự Động Bằng NLP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5.5">
                        Tự động trích xuất số tiền, tên ví và danh mục chi tiêu từ câu nhập tự nhiên hoặc giọng nói
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={nlpEnabled}
                      onChange={(e) => setNlpEnabled(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 mt-1 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/70">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-amber-500" />
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          Cảnh Báo Vượt Hạn Mức Thông Minh
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5.5">
                        Kích hoạt cảnh báo khi dự báo chi tiêu trong tháng vượt quá 90% giới hạn ngân sách
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={alertsEnabled}
                      onChange={(e) => setAlertsEnabled(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 mt-1 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/70">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          Tự Động Phân Loại Sau OCR
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5.5">
                        Tự động gắn thẻ danh mục thông minh dựa trên nội dung hàng hóa sau khi quét hóa đơn
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={ocrAutoTag}
                      onChange={(e) => setOcrAutoTag(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 mt-1 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng Xuất</span>
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-all active:scale-95"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Đã Lưu Thay Đổi</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Lưu Cài Đặt</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreated={() => {}}
        wallets={[]}
        categories={[]}
      />
      <OCRScanModal
        isOpen={isOCRModalOpen}
        onClose={() => setIsOCRModalOpen(false)}
        onCreated={() => {}}
        wallets={[]}
        categories={[]}
      />
    </div>
  );
}
