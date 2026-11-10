"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useLanguage } from "@/context/LanguageContext";
import {
  Cpu,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Save,
  Globe,
  Lock,
} from "lucide-react";

export default function AdminSettingsPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"general" | "ai" | "email" | "security">("general");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // General state
  const [appName, setAppName] = useState("Budgetly Smart Finance");
  const [supportEmail, setSupportEmail] = useState("support@budgetly.io");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // AI state
  const [aiModel, setAiModel] = useState("gemini-3.6-flash");
  const [aiConfidence, setAiConfidence] = useState(85);

  // Email state
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState(587);

  // Security state
  const [require2FA, setRequire2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(60);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification(language === "vi" ? "Đã lưu toàn bộ cấu hình hệ thống thành công!" : "System settings saved successfully!");
  };

  return (
    <div className="flex-1 pb-12 font-sans transition-colors duration-200">
      <AdminHeader
        title={language === "vi" ? "Cấu hình hệ thống & quản trị trung tâm" : "System Settings & Configuration"}
        subtitle={
          language === "vi"
            ? "Thiết lập tham số ứng dụng tổng thể, mô hình AI Engine, email SMTP và an toàn bảo mật"
            : "Configure global app parameters, AI Engine models, SMTP email, and security policies"
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

        {/* Maintenance Banner Warning */}
        {maintenanceMode && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-500/40 rounded-2xl flex items-center justify-between text-rose-800 dark:text-rose-200 text-xs shadow-xs">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <span>CẢNH BÁO: Chế độ bảo trì đang BẬT! Người dùng thông thường sẽ không thể truy cập ứng dụng.</span>
            </div>
            <button
              onClick={() => {
                setMaintenanceMode(false);
                showNotification(language === "vi" ? "Đã tắt chế độ bảo trì hệ thống" : "Maintenance mode disabled");
              }}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              {language === "vi" ? "Tắt chế độ bảo trì" : "Disable maintenance mode"}
            </button>
          </div>
        )}

        {/* Tab Selection Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "general"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{language === "vi" ? "Cấu hình chung" : "General"}</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "ai"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI Engine & OCR</span>
          </button>

          <button
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "email"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{language === "vi" ? "Máy chủ email SMTP" : "SMTP Email Server"}</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "security"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{language === "vi" ? "Bảo mật & phiên đăng nhập" : "Security & Sessions"}</span>
          </button>
        </div>

        {/* Form container */}
        <form onSubmit={handleSaveSettings} className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          {/* TAB 1: General */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {language === "vi" ? "Cấu hình chung hệ thống" : "General System Configuration"}
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi" ? "Tên ứng dụng" : "Application Name"}
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full max-w-md px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi" ? "Email hỗ trợ khách hàng" : "Customer Support Email"}
                </label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full max-w-md px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {language === "vi" ? "Bật chế độ bảo trì hệ thống (Maintenance mode)" : "Enable system maintenance mode"}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: AI */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {language === "vi" ? "Cấu hình AI Engine & nhận diện OCR" : "AI Engine & OCR Configuration"}
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi" ? "Mô hình AI mặc định" : "Default AI Model"}
                </label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full max-w-md px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="gemini-3.6-flash">Google Gemini 3.6 Flash ({language === "vi" ? "Nhanh & tối ưu" : "Fast & Optimized"})</option>
                  <option value="gemini-3.6-pro">Google Gemini 3.6 Pro ({language === "vi" ? "Phân tích chuyên sâu" : "Deep Analysis"})</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi"
                    ? `Ngưỡng tin cậy nhận diện hóa đơn tối thiểu (${aiConfidence}%)`
                    : `Minimum OCR Invoice Confidence Threshold (${aiConfidence}%)`}
                </label>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={aiConfidence}
                  onChange={(e) => setAiConfidence(Number(e.target.value))}
                  className="w-full max-w-md accent-emerald-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Email */}
          {activeTab === "email" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {language === "vi" ? "Cấu hình máy chủ email SMTP" : "SMTP Email Server Configuration"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">SMTP Host</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">SMTP Port</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Security */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {language === "vi" ? "Bảo mật & quản lý phiên làm việc" : "Security & Session Management"}
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi" ? "Thời gian hết hạn phiên (phút)" : "Session Timeout (minutes)"}
                </label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full max-w-md px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={require2FA}
                    onChange={(e) => setRequire2FA(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {language === "vi"
                      ? "Bắt buộc xác thực hai yếu tố (2FA) cho tất cả tài khoản quản trị viên"
                      : "Require Two-Factor Authentication (2FA) for all Administrator accounts"}
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{language === "vi" ? "Lưu cấu hình" : "Save configuration"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
