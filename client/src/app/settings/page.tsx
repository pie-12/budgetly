"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import OCRScanModal from "@/components/modals/OCRScanModal";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { api, getErrorMessage } from "@/services/api";
import {
  User,
  Moon,
  Sun,
  Sparkles,
  Bell,
  Shield,
  Save,
  Check,
  LogOut,
  Mail,
  Palette,
  Bot,
  Globe,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [nlpEnabled, setNlpEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [ocrAutoTag, setOcrAutoTag] = useState(true);

  // Profile save state
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError(null);
    setIsSavingProfile(true);

    try {
      await api.updateProfile({ full_name: fullName.trim() });
      await refreshUser();
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (err) {
      setProfileError(getErrorMessage(err, "Không thể cập nhật hồ sơ người dùng."));
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError(language === "vi" ? "Vui lòng nhập mật khẩu hiện tại." : "Please enter your current password.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(t("password_min_length"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t("password_mismatch"));
      return;
    }

    setIsSavingPassword(true);
    try {
      await api.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      setPasswordSuccess(t("change_password_success"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setPasswordSuccess(null);
      }, 5000);
    } catch (err) {
      setPasswordError(getErrorMessage(err, language === "vi" ? "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại." : "Failed to change password. Please verify current password."));
    } finally {
      setIsSavingPassword(false);
    }
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
              {t("settings_title")}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t("settings_subtitle")}
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
                    {t("profile_info")}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("full_name")}
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
                      {t("email")}
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

                {profileError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{profileError}</span>
                  </div>
                )}

                {isSaved && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{t("profile_updated_success")}</span>
                  </div>
                )}
              </div>

              {/* Security & Change Password Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs transition-colors duration-200">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <KeyRound className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {t("security_settings")}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {t("security_desc")}
                    </p>
                  </div>
                </div>

                {passwordError && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <div className="space-y-3.5">
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {t("current_password")}
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t("new_password")}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="Tối thiểu 6 ký tự..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {t("confirm_new_password")}
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="Nhập lại mật khẩu mới..."
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={isSavingPassword || !currentPassword || !newPassword}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      {isSavingPassword ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{language === "vi" ? "Đang xử lý..." : "Updating..."}</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>{t("change_password_btn")}</span>
                        </>
                      )}
                    </button>
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
                      {t("appearance_mode")}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === "vi" ? "Tùy chọn phong cách hiển thị ứng dụng phù hợp với môi trường làm việc" : "Display styling and color scheme preferences"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Light Mode Button */}
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${
                      theme === "light"
                        ? "bg-emerald-50/50 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{t("light_mode")}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {language === "vi" ? "Sạch sẽ, dịu mắt ban ngày" : "Clean daylight contrast"}
                      </div>
                    </div>
                  </button>

                  {/* Dark Mode Button */}
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition-all cursor-pointer ${
                      theme === "dark"
                        ? "bg-slate-800/80 border-emerald-500 text-slate-100 ring-2 ring-emerald-500/20 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{t("dark_mode")}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {language === "vi" ? "Fintech hiện đại, tập trung cao" : "Modern sleek fintech aesthetics"}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Language Selection Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xs transition-colors duration-200">
                <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Globe className="w-4 h-4" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {language === "vi" ? "Ngôn ngữ hệ thống (Language)" : "System Language"}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === "vi" ? "Đồng bộ ngôn ngữ hiển thị trên toàn bộ trang người dùng và trang quản trị" : "Synchronize language across both user portal and admin side"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Vietnamese */}
                  <button
                    type="button"
                    onClick={() => setLanguage("vi")}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      language === "vi"
                        ? "bg-emerald-50/50 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 font-extrabold text-sm flex items-center justify-center shrink-0">
                      VN
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Tiếng Việt</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Mặc định hệ thống</div>
                    </div>
                  </button>

                  {/* English */}
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                      language === "en"
                        ? "bg-emerald-50/50 border-emerald-500 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 font-extrabold text-sm flex items-center justify-center shrink-0">
                      EN
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">English</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">Global language</div>
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
                      {t("ai_config")}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === "vi" ? "Thiết lập các tính năng xử lý ngôn ngữ tự nhiên và phát hiện rủi ro chi tiêu" : "NLP transaction parsing and smart budget anomaly rules"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/70 dark:border-slate-800/70">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          {language === "vi" ? "Phân tích tự động bằng NLP" : "Automatic NLP categorization"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5.5">
                        {language === "vi" ? "Tự động trích xuất số tiền, tên ví và danh mục chi tiêu từ câu nhập tự nhiên hoặc giọng nói" : "Extract amounts, wallets, and categories from natural voice or text"}
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
                          {language === "vi" ? "Cảnh báo vượt hạn mức thông minh" : "Smart overspending alerts"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5.5">
                        {language === "vi" ? "Kích hoạt cảnh báo khi dự báo chi tiêu trong tháng vượt quá 90% giới hạn ngân sách" : "Trigger warnings when projected spend exceeds 90% of budget cap"}
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
                          {language === "vi" ? "Tự động phân loại sau OCR" : "Auto-tagging after OCR"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5.5">
                        {language === "vi" ? "Tự động gắn thẻ danh mục thông minh dựa trên nội dung hàng hóa sau khi quét hóa đơn" : "Automatically assign category based on invoice item contents"}
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
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t("logout")}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  {isSavingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{language === "vi" ? "Đang lưu..." : "Saving..."}</span>
                    </>
                  ) : isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{language === "vi" ? "Đã lưu thay đổi" : "Preferences saved"}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{t("save_settings")}</span>
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
