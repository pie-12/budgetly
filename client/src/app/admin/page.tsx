"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import Link from "next/link";
import {
  Users,
  Receipt,
  FolderKanban,
  Target,
  BarChart3,
  Bell,
  ScrollText,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Server,
  Activity,
  Cpu,
  Database,
  ArrowUpRight,
  Zap,
  UserPlus,
  ShieldAlert,
  Send,
  PlusCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  const handleTriggerBackup = () => {
    setBackupStatus("running");
    setTimeout(() => {
      setBackupStatus("completed");
      setTimeout(() => setBackupStatus(null), 4000);
    }, 1500);
  };

  const statCards = [
    {
      title: "Total Users",
      value: "1,248",
      change: "+14.2%",
      isPositive: true,
      subtext: "128 new users this month",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-400",
    },
    {
      title: "Total System Transactions",
      value: "45,890",
      change: "+22.5%",
      isPositive: true,
      subtext: "Total value: 4.85B VND",
      icon: Receipt,
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-400",
    },
    {
      title: "Suspected Fraud Alerts",
      value: "12",
      change: "-5%",
      isPositive: true,
      subtext: "Requires immediate admin review",
      icon: AlertTriangle,
      color: "from-rose-600 to-pink-600",
      textColor: "text-rose-400",
    },
    {
      title: "AI OCR Scans",
      value: "8,940",
      change: "+38.4%",
      isPositive: true,
      subtext: "AI accuracy: 98.6%",
      icon: Zap,
      color: "from-purple-600 to-amber-600",
      textColor: "text-purple-400",
    },
  ];

  const quickModules = [
    { title: "👤 Users", desc: "Manage 1,248 accounts", href: "/admin/users", count: "1.2k" },
    { title: "🏷️ Categories", desc: "Manage 24 income & expense categories", href: "/admin/categories", count: "24" },
    { title: "💸 Transactions", desc: "Monitor system money flow", href: "/admin/transactions", count: "45k" },
    { title: "🎯 Budgets", desc: "Budget alerts & limits", href: "/admin/budgets", count: "850" },
    { title: "📈 Reports", desc: "Revenue & growth reports", href: "/admin/reports", count: "Monthly" },
    { title: "🔔 Notifications", desc: "Send notifications & broadcasts", href: "/admin/notifications", count: "3 Active" },
    { title: "📝 Audit Logs", desc: "Security & access logs", href: "/admin/audit-logs", count: "Live" },
    { title: "👑 Roles & Permissions", desc: "System administration permissions", href: "/admin/roles", count: "5 Roles" },
    { title: "⚙️ Settings", desc: "AI, Email & Security configuration", href: "/admin/settings", count: "v2.4" },
  ];

  const recentLogs = [
    { id: 1, user: "admin_lam", action: "UPDATE_CONFIG", target: "System AI Threshold", time: "2 minutes ago", status: "success" },
    { id: 2, user: "mod_hoa", action: "LOCK_USER", target: "user_fake99@gmail.com", time: "15 minutes ago", status: "danger" },
    { id: 3, user: "admin_lam", action: "CREATE_CATEGORY", target: "Crypto Investment", time: "1 hour ago", status: "success" },
    { id: 4, user: "system_cron", action: "AUTO_BACKUP", target: "DB PostgreSQL Snapshot", time: "3 hours ago", status: "info" },
  ];

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="📊 System Admin Dashboard"
        subtitle="Overview of activity, performance, and key admin features"
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Backup Status Toast Banner */}
        {backupStatus === "running" && (
          <div className="p-4 bg-indigo-950/80 border border-indigo-500/40 rounded-2xl flex items-center gap-3 text-indigo-200 animate-pulse text-sm">
            <Activity className="w-5 h-5 text-indigo-400 animate-spin" />
            <span>System backup of PostgreSQL Snapshot in progress...</span>
          </div>
        )}
        {backupStatus === "completed" && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-200 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Backup completed successfully! The backup has been saved to secure storage.</span>
          </div>
        )}

        {/* 1. Stat Indicator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all duration-300 shadow-lg relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">{card.value}</h2>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                      card.isPositive
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {card.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {card.change}
                  </span>
                </div>

                <p className="text-xs text-slate-400">{card.subtext}</p>

                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all"></div>
              </div>
            );
          })}
        </div>

        {/* 2. Quick Access Hub to all 10 modules */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>🚀 Core Admin Modules</span>
              </h2>
              <p className="text-xs text-slate-400">Quick access to the 10 required management modules</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {quickModules.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="p-5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 rounded-2xl transition-all duration-200 group flex items-start justify-between"
              >
                <div>
                  <h3 className="font-bold text-slate-200 group-hover:text-indigo-400 text-sm flex items-center gap-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.count}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 3. System Infrastructure & Health Status + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Server Infrastructure Health */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Server Infrastructure & Performance</h3>
                  <p className="text-xs text-slate-400">Realtime server resource monitoring</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                All nodes operational
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-400" /> CPU Usage
                  </span>
                  <span className="text-indigo-400 font-bold">28.4%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[28.4%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-500">8 Cores Intel Xeon E5</p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-400" /> RAM Allocated
                  </span>
                  <span className="text-emerald-400 font-bold">4.2 GB / 16 GB</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[26%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-500">PostgreSQL + Node.js Pool</p>
              </div>

              <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-purple-400" /> API Latency
                  </span>
                  <span className="text-purple-400 font-bold">42 ms</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[15%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-500">FastResponse API Edge</p>
              </div>
            </div>

            {/* Live activity log snippet */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                Recent Activity Log (Audit Stream)
              </h4>
              <div className="space-y-2">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                      <span className="font-semibold text-slate-300">{log.user}</span>
                      <span className="text-slate-500">performed</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[11px] border border-indigo-500/20">
                        {log.action}
                      </span>
                      <span className="text-slate-400 truncate max-w-[150px] sm:max-w-none">
                        ({log.target})
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px]">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-base mb-1">Quick Admin Actions</h3>
              <p className="text-xs text-slate-400 mb-6">Run common tasks with a single click</p>

              <div className="space-y-3">
                <Link
                  href="/admin/notifications"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 transition-all font-medium text-xs"
                >
                  <Send className="w-4 h-4 text-indigo-400" />
                  <span>Send System-wide Broadcast Notification</span>
                </Link>

                <Link
                  href="/admin/categories"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 transition-all font-medium text-xs"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Add New Category for Users</span>
                </Link>

                <Link
                  href="/admin/users"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 transition-all font-medium text-xs"
                >
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  <span>Create Admin / Auditor Account</span>
                </Link>

                <button
                  onClick={handleTriggerBackup}
                  disabled={backupStatus === "running"}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 transition-all font-medium text-xs text-left"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-400" />
                  <span>Run Immediate Database Backup</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-500">
                Need technical support? Contact the Infrastructure Support team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
