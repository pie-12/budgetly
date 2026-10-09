"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  Target,
  BarChart3,
  Bell,
  ScrollText,
  ShieldCheck,
  Settings,
  ArrowLeft,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export const adminNavItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    badge: "Live",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    badge: "1,248",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: FolderKanban,
  },
  {
    name: "Transactions",
    href: "/admin/transactions",
    icon: Receipt,
    badge: "12 Fraud",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse",
  },
  {
    name: "Budgets",
    href: "/admin/budgets",
    icon: Target,
  },
  {
    name: "Reports",
    href: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
    badge: "3 Scheduled",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  {
    name: "Audit Logs",
    href: "/admin/audit-logs",
    icon: ScrollText,
  },
  {
    name: "Roles & Permissions",
    href: "/admin/roles",
    icon: ShieldCheck,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col shrink-0 border-r border-slate-800 min-h-screen sticky top-0 h-screen">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-bold text-lg tracking-wide text-white">Budgetly</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              System v2.4.0
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          System Administration
        </div>
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System Status Banner */}
      <div className="p-3 mx-3 mb-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-slate-400 font-medium">Server Status</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 99.98%
          </span>
        </div>
        <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full w-[99.9%] rounded-full"></div>
        </div>
      </div>

      {/* Exit to App & User Profile Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-all border border-slate-700/50"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to User Site</span>
        </Link>

        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900 border border-slate-800">
          <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
            SA
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <p className="text-xs font-semibold text-slate-200 truncate">Super Admin</p>
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
            </div>
            <p className="text-[11px] text-slate-400 truncate">admin@budgetly.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
