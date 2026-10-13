"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Camera, Plus, LogIn, LogOut, User as UserIcon } from "lucide-react";

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenOCRModal: () => void;
}

export default function Header({ onOpenAddModal, onOpenOCRModal }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Title / Context info */}
      <div className="flex items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-100 tracking-tight">
          Bảng Điều Khiển Tài Chính
        </h2>
        <span className="hidden sm:inline-flex px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Tháng 10/2026
        </span>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* OCR Scan Button */}
        <button
          onClick={onOpenOCRModal}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/80 transition-all shadow-sm active:scale-95"
        >
          <Camera className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Quét Hóa Đơn (OCR)</span>
          <span className="sm:hidden">OCR</span>
        </button>

        {/* Add Transaction Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/25 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm Giao Dịch</span>
        </button>

        {/* User Account / Auth status button */}
        <div className="pl-2 border-l border-slate-800 flex items-center gap-2">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <div
                title={user.email}
                className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-sm"
              >
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
