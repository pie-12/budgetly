"use client";

import { useState } from "react";
import { Search, Bell, RefreshCw, CheckCircle2, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AdminHeader({
  title = "Bảng Điều Khiển Quản Trị",
  subtitle = "Giám sát tài nguyên hệ thống & vận hành theo thời gian thực",
}: AdminHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 800);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 sm:px-8 py-3.5 flex items-center justify-between transition-colors duration-200">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          {title}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Global Search Bar */}
        <div className="relative w-48 sm:w-72 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={1.8} />
          <input
            type="text"
            placeholder="Tìm user, transaction ID, audit log..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:hover:text-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all active:scale-95"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.8} />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" strokeWidth={1.8} />
          )}
        </button>

        {/* Refresh Action */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700/50 transition-all flex items-center gap-1.5 text-xs font-semibold"
          title="Làm mới dữ liệu hệ thống"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-indigo-500" : ""}`} strokeWidth={1.8} />
          <span className="hidden sm:inline">Làm mới</span>
        </button>

        {/* System Notifications Quick Button */}
        <div className="relative">
          <button className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700/50 transition-all relative">
            <Bell className="w-4 h-4" strokeWidth={1.8} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
        </div>

        {/* Admin Quick Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse"></span>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">
            Live
          </span>
        </div>
      </div>

      {/* Toast feedback */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/40 rounded-2xl shadow-xl animate-fade-in text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Dữ liệu hệ thống đã được đồng bộ mới nhất!</span>
        </div>
      )}
    </header>
  );
}
