"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ScanLine, Plus, LogIn, LogOut, Sun, Moon, CalendarDays, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenOCRModal: () => void;
}

export default function Header({ onOpenAddModal, onOpenOCRModal }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-200">
      {/* Title / Context info */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          Bảng Điều Khiển
        </h2>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
          <CalendarDays className="w-3.5 h-3.5" strokeWidth={1.8} />
          <span>Tháng 10/2026</span>
        </span>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-400 dark:bg-slate-800 dark:hover:text-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80 transition-all duration-200 active:scale-95"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" strokeWidth={1.8} />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" strokeWidth={1.8} />
          )}
        </button>

        {/* OCR Scan Button */}
        <button
          onClick={onOpenOCRModal}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:hover:text-white border border-slate-200/80 dark:border-slate-700/80 transition-all shadow-xs active:scale-95"
        >
          <ScanLine className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
          <span className="hidden sm:inline">Quét Hóa Đơn (OCR)</span>
          <span className="sm:hidden">OCR</span>
        </button>

        {/* Add Transaction Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm shadow-emerald-600/25 active:scale-95"
        >
          <Plus className="w-4 h-4" strokeWidth={2} />
          <span>Thêm Giao Dịch</span>
        </button>

        {/* User Account / Auth status button */}
        <div className="pl-2 border-l border-slate-200 dark:border-slate-800 flex items-center gap-2">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div
                title={user.email}
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-xs"
              >
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-1.5 text-slate-500 hover:text-rose-500 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.8} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
