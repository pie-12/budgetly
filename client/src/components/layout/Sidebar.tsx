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
  ShieldAlert,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Wallets",
    href: "/wallets",
    icon: Wallet,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    name: "Budgets",
    href: "/budgets",
    icon: Target,
  },
  {
    name: "Reports & Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    name: "System Administration",
    href: "/admin",
    icon: ShieldAlert,
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
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between hidden md:flex shrink-0 min-h-screen">
      <div className="flex-1 flex flex-col min-h-0">
        {/* Brand Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-slate-950 font-black text-xl">B</span>
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-none">
              Budgetly<span className="text-emerald-400 text-xs ml-1 font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">Smart Financial Suite</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 overflow-y-auto flex-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile / Auth Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/60">
        {isAuthenticated && user ? (
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-800/50 border border-slate-700/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md">
                {userInitial}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">
                  {user.full_name || "User"}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign out of the system"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/register"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700/60 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
