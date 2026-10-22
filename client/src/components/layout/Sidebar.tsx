"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  Target,
  BarChart3,
  Settings,
  ShieldCheck,
  Sparkles,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";

const navItems = [
  {
    name: "Bảng điều khiển",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Ví tài chính",
    href: "/wallets",
    icon: Wallet,
  },
  {
    name: "Giao dịch",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Ngân sách",
    href: "/budgets",
    icon: Target,
  },
  {
    name: "Báo cáo & Thống kê",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Cài đặt",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "Quản trị hệ thống",
    href: "/admin",
    icon: ShieldCheck,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  const userInitial = user?.full_name
    ? user.full_name.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between hidden md:flex shrink-0 min-h-screen transition-colors duration-200">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200/80 dark:border-slate-800 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-sm shadow-emerald-500/20 text-white font-extrabold text-lg">
            B
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-base tracking-tight text-slate-900 dark:text-white leading-none">
                Budgetly
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Quản Lý Tài Chính Thông Minh</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Menu Chính
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500"
                  }`}
                  strokeWidth={isActive ? 2 : 1.75}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* AI Assistant Banner */}
      <div className="p-3.5 mx-3 mb-3 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Budgetly Copilot</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-2.5">
          Tự động phân loại chi tiêu và dự báo tài chính theo thời gian thực.
        </p>
        <div className="flex items-center justify-between text-[10px] text-slate-600 dark:text-slate-300 font-medium bg-white dark:bg-slate-950/70 py-1.5 px-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800">
          <span>AI Engine</span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Hoạt động
          </span>
        </div>
      </div>

      {/* User Profile / Auth Footer */}
      <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {user.full_name || "Người dùng"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Đăng xuất khỏi hệ thống"
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.8} />
            </button>
          </div>
        ) : (
          <div className="space-y-1.5">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all"
            >
              <LogIn className="w-3.5 h-3.5" strokeWidth={1.8} />
              <span>Đăng Nhập</span>
            </Link>
            <Link
              href="/register"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold border border-slate-200 dark:border-slate-700/60 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" strokeWidth={1.8} />
              <span>Đăng Ký Tài Khoản</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
