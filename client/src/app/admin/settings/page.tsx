"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Settings as SettingsIcon,
  Cpu,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Save,
  Globe,
  Sliders,
  Lock,
  Key,
} from "lucide-react";

export default function AdminSettingsPage() {
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
    showNotification("System settings saved successfully!");
  };

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="⚙️ System Settings & Admin Configuration"
        subtitle="Configure the overall app, AI Engine, SMTP email, and security parameters"
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-2xl text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Maintenance Banner Warning */}
        {maintenanceMode && (
          <div className="p-4 bg-rose-950/80 border border-rose-500/40 rounded-2xl flex items-center justify-between text-rose-200 text-xs">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>WARNING: Maintenance Mode is ON! Regular users will not be able to access the app.</span>
            </div>
            <button
              onClick={() => {
                setMaintenanceMode(false);
                showNotification("System maintenance mode turned off");
              }}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
            >
              Turn Off Maintenance
            </button>
          </div>
        )}

        {/* Tab Selection Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "general"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>General</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "ai"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>AI Engine & OCR</span>
          </button>

          <button
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "email"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Email SMTP</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "security"
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security & Session</span>
          </button>
        </div>

        {/* Form container */}
        <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          {/* TAB 1: General */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100">General System Configuration</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">App Name</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full max-w-md px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Customer Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="w-full max-w-md px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    Enable system maintenance mode
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: AI */}
          {activeTab === "ai" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100">AI Engine & OCR Assistant Configuration</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Default AI Model</label>
                <select
                  value={aiModel}
                  onChange={(e) => setAiModel(e.target.value)}
                  className="w-full max-w-md px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="gemini-3.6-flash">Google Gemini 3.6 Flash (Fast & optimized)</option>
                  <option value="gemini-3.6-pro">Google Gemini 3.6 Pro (Advanced analytics)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Minimum OCR Scan Confidence Threshold ({aiConfidence}%)
                </label>
                <input
                  type="range"
                  min="50"
                  max="99"
                  value={aiConfidence}
                  onChange={(e) => setAiConfidence(Number(e.target.value))}
                  className="w-full max-w-md accent-indigo-600"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Email */}
          {activeTab === "email" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100">SMTP Email Server Configuration</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">SMTP Host</label>
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">SMTP Port</label>
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Security */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-100">Security & Login Session Management</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Session Timeout (Minutes)
                </label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-full max-w-md px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={require2FA}
                    onChange={(e) => setRequire2FA(e.target.checked)}
                    className="w-4 h-4 accent-indigo-600 rounded"
                  />
                  <span className="text-xs font-semibold text-slate-200">
                    Require two-factor authentication (2FA) for Admin accounts
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
