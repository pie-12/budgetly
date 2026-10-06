"use client";

import { useState } from "react";
import { Search, Bell, Shield, Sparkles, RefreshCw, Download, CheckCircle2 } from "lucide-react";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  title = "Bảng điều khiển Quản trị",
  subtitle = "Theo dõi hệ thống & quản lý tài nguyên realtime",
}: AdminHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 py-4 flex items-center justify-between">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4">
        {/* Global Search Bar */}
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm user, transaction ID, audit log..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Refresh Action */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-all flex items-center gap-1.5 text-xs font-medium"
          title="Làm mới dữ liệu hệ thống"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* System Notifications Quick Button */}
        <div className="relative">
          <button className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50 transition-all relative">
            <Bell className="w-4 h-4 text-slate-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-slate-900"></span>
          </button>
        </div>

        {/* Admin Quick Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse"></span>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
            System Live
          </span>
        </div>
      </div>

      {/* Toast feedback */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-2xl animate-fade-in text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Dữ liệu hệ thống đã được đồng bộ mới nhất!</span>
        </div>
      )}
    </header>
  );
}
