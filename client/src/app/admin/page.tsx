"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import {
  Users,
  Receipt,
  Target,
  BarChart3,
  Bell,
  FileText,
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
  Send,
  PlusCircle,
  FileSpreadsheet,
  Tags,
  ArrowLeftRight,
  Settings,
  LayoutGrid,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { t, language } = useLanguage();
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
      title: t("total_users_stat"),
      value: "1,248",
      change: "+14.2%",
      isPositive: true,
      subtext: `128 ${t("new_users_month")}`,
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-500",
    },
    {
      title: t("total_tx_stat"),
      value: "45,890",
      change: "+22.5%",
      isPositive: true,
      subtext: `${t("total_flow")}: 4.85 tỷ ₫`,
      icon: Receipt,
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-500",
    },
    {
      title: t("fraud_alerts_stat"),
      value: "12",
      change: "-5%",
      isPositive: true,
      subtext: t("requires_review"),
      icon: AlertTriangle,
      color: "from-rose-600 to-pink-600",
      textColor: "text-rose-500",
    },
    {
      title: t("ocr_scans_stat"),
      value: "8,940",
      change: "+38.4%",
      isPositive: true,
      subtext: `${t("ai_accuracy")} 98.6%`,
      icon: Zap,
      color: "from-purple-600 to-amber-600",
      textColor: "text-purple-500",
    },
  ];

  const quickModules = [
    { title: t("admin_nav_users"), desc: language === "vi" ? "Quản lý 1,248 tài khoản" : "Manage 1,248 accounts", href: "/admin/users", count: "1.2k", icon: Users },
    { title: t("admin_nav_categories"), desc: language === "vi" ? "24 danh mục thu chi mặc định" : "24 default categories", href: "/admin/categories", count: "24", icon: Tags },
    { title: t("admin_nav_transactions"), desc: language === "vi" ? "Giám sát luồng tiền hệ thống" : "Monitor system money flows", href: "/admin/transactions", count: "45k", icon: ArrowLeftRight },
    { title: t("admin_nav_budgets"), desc: language === "vi" ? "Cảnh báo hạn mức & chỉ tiêu" : "Budget threshold alerts", href: "/admin/budgets", count: "850", icon: Target },
    { title: t("admin_nav_reports"), desc: language === "vi" ? "Tăng trưởng & doanh số dịch vụ" : "Revenue & growth reports", href: "/admin/reports", count: language === "vi" ? "Hàng tháng" : "Monthly", icon: BarChart3 },
    { title: t("admin_nav_notifications"), desc: language === "vi" ? "Gửi thông báo & tin tức broadcast" : "Broadcast system messages", href: "/admin/notifications", count: language === "vi" ? "3 đang chạy" : "3 Active", icon: Bell },
    { title: t("admin_nav_audit"), desc: language === "vi" ? "Lịch sử bảo mật & thao tác" : "Security & access audit logs", href: "/admin/audit-logs", count: language === "vi" ? "Trực tiếp" : "Live", icon: FileText },
    { title: t("admin_nav_roles"), desc: language === "vi" ? "Vai trò & quyền hạn quản trị" : "Admin roles & permissions", href: "/admin/roles", count: language === "vi" ? "5 vai trò" : "5 Roles", icon: ShieldCheck },
    { title: t("admin_nav_settings"), desc: language === "vi" ? "Cấu hình AI, email & bảo mật" : "AI, Email & security config", href: "/admin/settings", count: "v2.4", icon: Settings },
  ];

  const recentLogs = [
    { id: 1, user: "admin_lam", action: "UPDATE_CONFIG", target: "System AI Threshold", time: language === "vi" ? "2 phút trước" : "2 mins ago", status: "success" },
    { id: 2, user: "mod_hoa", action: "LOCK_USER", target: "user_fake99@gmail.com", time: language === "vi" ? "15 phút trước" : "15 mins ago", status: "danger" },
    { id: 3, user: "admin_lam", action: "CREATE_CATEGORY", target: "Crypto Investment", time: language === "vi" ? "1 giờ trước" : "1 hour ago", status: "success" },
    { id: 4, user: "system_cron", action: "AUTO_BACKUP", target: "DB PostgreSQL Snapshot", time: language === "vi" ? "3 giờ trước" : "3 hours ago", status: "info" },
  ];

  return (
    <div className="flex-1 pb-12 font-sans transition-colors duration-200">
      <AdminHeader
        title={t("admin_dashboard_title")}
        subtitle={t("admin_dashboard_sub")}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Backup Status Toast Banner */}
        {backupStatus === "running" && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/40 rounded-2xl flex items-center gap-3 text-indigo-700 dark:text-indigo-200 animate-pulse text-sm">
            <Activity className="w-5 h-5 text-indigo-500 animate-spin" />
            <span>{language === "vi" ? "Hệ thống đang sao lưu snapshot cơ sở dữ liệu PostgreSQL..." : "System database snapshot backup in progress..."}</span>
          </div>
        )}
        {backupStatus === "completed" && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-700 dark:text-emerald-200 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>{language === "vi" ? "Sao lưu dữ liệu thành công! Bản ghi đã được đồng bộ an toàn." : "Database backup completed successfully!"}</span>
          </div>
        )}

        {/* 1. Stat Indicator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-300 shadow-xs relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {card.value}
                  </h2>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 ${
                      card.isPositive
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                        : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
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

                <p className="text-xs text-slate-500 dark:text-slate-400">{card.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* 2. Quick Access Hub to all 9 modules */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-emerald-500" />
                <span>{t("core_modules")}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {language === "vi" ? "Truy cập nhanh vào các tính năng quản lý và phân quyền" : "Quick access to all management modules"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {quickModules.map((item, idx) => {
              const ItemIcon = item.icon;
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className="p-5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/40 rounded-2xl transition-all duration-200 group flex items-start justify-between shadow-xs hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0">
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-sm">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {item.count}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 3. System Infrastructure & Health Status + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Server Infrastructure Health */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    {t("server_infrastructure")}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {language === "vi" ? "Giám sát tài nguyên thời gian thực" : "Realtime system metrics"}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {t("all_nodes_operational")}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-500" /> {t("cpu_load")}
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">28.4%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[28.4%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">8 Cores Intel Xeon E5</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-emerald-500" /> {t("ram_allocated")}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">4.2 GB / 16 GB</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[26%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">PostgreSQL + Next.js Server</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-purple-500" /> {t("api_latency")}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">42 ms</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[15%] rounded-full"></div>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">FastResponse API Gateway</p>
              </div>
            </div>

            {/* Live activity log snippet */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                {t("recent_audit_stream")}
              </h4>
              <div className="space-y-2">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      <span className="font-semibold text-slate-800 dark:text-slate-300">{log.user}</span>
                      <span className="text-slate-500">{language === "vi" ? "thực hiện" : "performed"}</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] border border-indigo-200 dark:border-indigo-500/20">
                        {log.action}
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 truncate max-w-[150px] sm:max-w-none">
                        ({log.target})
                      </span>
                    </div>
                    <span className="text-slate-400 dark:text-slate-500 text-[11px]">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">{t("quick_actions")}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                {language === "vi" ? "Thực hiện các tác vụ phổ biến với 1 nhấp chuột" : "Perform routine admin tasks with one click"}
              </p>

              <div className="space-y-3">
                <Link
                  href="/admin/notifications"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-600/10 hover:bg-indigo-100 dark:hover:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 transition-all font-medium text-xs"
                >
                  <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>{t("broadcast_btn")}</span>
                </Link>

                <Link
                  href="/admin/categories"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-all font-medium text-xs"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t("add_category_btn")}</span>
                </Link>

                <Link
                  href="/admin/users"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-all font-medium text-xs"
                >
                  <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>{t("create_admin_acc")}</span>
                </Link>

                <button
                  onClick={handleTriggerBackup}
                  disabled={backupStatus === "running"}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-all font-medium text-xs text-left cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{t("backup_db_btn")}</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {language === "vi" ? "Hỗ trợ kỹ thuật: Liên hệ đội ngũ DevOps hạ tầng Budgetly" : "Technical Support: Contact Budgetly Infrastructure Team"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
