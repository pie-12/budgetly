"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
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
      title: "Tổng Người Dùng",
      value: "1,248",
      change: "+14.2%",
      isPositive: true,
      subtext: "128 người dùng mới trong tháng",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-500",
    },
    {
      title: "Giao Dịch Hệ Thống",
      value: "45,890",
      change: "+22.5%",
      isPositive: true,
      subtext: "Tổng luân chuyển: 4.85 tỷ ₫",
      icon: Receipt,
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-500",
    },
    {
      title: "Cảnh Báo Bất Thường",
      value: "12",
      change: "-5%",
      isPositive: true,
      subtext: "Yêu cầu kiểm duyệt viên rà soát",
      icon: AlertTriangle,
      color: "from-rose-600 to-pink-600",
      textColor: "text-rose-500",
    },
    {
      title: "Lượt Quét OCR Hóa Đơn",
      value: "8,940",
      change: "+38.4%",
      isPositive: true,
      subtext: "Độ chính xác AI nhận diện 98.6%",
      icon: Zap,
      color: "from-purple-600 to-amber-600",
      textColor: "text-purple-500",
    },
  ];

  const quickModules = [
    { title: "Người Dùng", desc: "Quản lý 1,248 tài khoản", href: "/admin/users", count: "1.2k", icon: Users },
    { title: "Danh Mục", desc: "24 danh mục thu chi mặc định", href: "/admin/categories", count: "24", icon: Tags },
    { title: "Giao Dịch", desc: "Giám sát luồng tiền hệ thống", href: "/admin/transactions", count: "45k", icon: ArrowLeftRight },
    { title: "Ngân Sách", desc: "Cảnh báo hạn mức & chỉ tiêu", href: "/admin/budgets", count: "850", icon: Target },
    { title: "Báo Cáo", desc: "Tăng trưởng & doanh số dịch vụ", href: "/admin/reports", count: "Hàng tháng", icon: BarChart3 },
    { title: "Thông Báo", desc: "Gửi thông báo & tin tức broadcast", href: "/admin/notifications", count: "3 Đang chạy", icon: Bell },
    { title: "Nhật Ký Audit", desc: "Lịch sử bảo mật & thao tác", href: "/admin/audit-logs", count: "Trực tiếp", icon: FileText },
    { title: "Phân Quyền", desc: "Vai trò & quyền hạn quản trị", href: "/admin/roles", count: "5 Vai trò", icon: ShieldCheck },
    { title: "Cài Đặt", desc: "Cấu hình AI, Email & Bảo mật", href: "/admin/settings", count: "v2.4", icon: Settings },
  ];

  const recentLogs = [
    { id: 1, user: "admin_lam", action: "UPDATE_CONFIG", target: "System AI Threshold", time: "2 phút trước", status: "success" },
    { id: 2, user: "mod_hoa", action: "LOCK_USER", target: "user_fake99@gmail.com", time: "15 phút trước", status: "danger" },
    { id: 3, user: "admin_lam", action: "CREATE_CATEGORY", target: "Crypto Investment", time: "1 giờ trước", status: "success" },
    { id: 4, user: "system_cron", action: "AUTO_BACKUP", target: "DB PostgreSQL Snapshot", time: "3 giờ trước", status: "info" },
  ];

  return (
    <div className="flex-1 pb-12 font-sans transition-colors duration-200">
      <AdminHeader
        title="Bảng Điều Khiển Quản Trị Hệ Thống"
        subtitle="Tổng quan hoạt động, hiệu suất máy chủ và các phân hệ quản lý cốt lõi"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
        {/* Backup Status Toast Banner */}
        {backupStatus === "running" && (
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-500/40 rounded-2xl flex items-center gap-3 text-indigo-700 dark:text-indigo-200 animate-pulse text-sm">
            <Activity className="w-5 h-5 text-indigo-500 animate-spin" />
            <span>Hệ thống đang sao lưu snapshot cơ sở dữ liệu PostgreSQL...</span>
          </div>
        )}
        {backupStatus === "completed" && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 rounded-2xl flex items-center gap-3 text-emerald-700 dark:text-emerald-200 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <span>Sao lưu dữ liệu thành công! Bản ghi đã được đồng bộ an toàn.</span>
          </div>
        )}

        {/* 1. Stat Indicator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 shadow-xs relative overflow-hidden group"
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
                <span>Các Phân Hệ Quản Trị Hệ Thống</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Truy cập nhanh vào các tính năng quản lý và phân quyền
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
                  className="p-5 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-500/40 rounded-2xl transition-all duration-200 group flex items-start justify-between shadow-xs"
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
                    Hạ Tầng Máy Chủ & Hiệu Năng
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Giám sát tài nguyên thời gian thực</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Tất cả node hoạt động
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-500" /> Tải CPU
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
                    <Database className="w-4 h-4 text-emerald-500" /> Bộ Nhớ RAM
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
                    <Activity className="w-4 h-4 text-purple-500" /> Độ Trễ API
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
                Nhật Ký Thao Tác Gần Đây (Audit Stream)
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
                      <span className="text-slate-500">thực hiện</span>
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
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base mb-1">Thao Tác Nhanh</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">Thực hiện các tác vụ phổ biến với 1 nhấp chuột</p>

              <div className="space-y-3">
                <Link
                  href="/admin/notifications"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-600/10 hover:bg-indigo-100 dark:hover:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 transition-all font-medium text-xs"
                >
                  <Send className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Phát Thông Báo Toàn Hệ Thống</span>
                </Link>

                <Link
                  href="/admin/categories"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-all font-medium text-xs"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Thêm Danh Mục Chi Tiêu Mới</span>
                </Link>

                <Link
                  href="/admin/users"
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-all font-medium text-xs"
                >
                  <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Tạo Tài Khoản Quản Trị Viên</span>
                </Link>

                <button
                  onClick={handleTriggerBackup}
                  disabled={backupStatus === "running"}
                  className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-all font-medium text-xs text-left cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Sao Lưu Cơ Sở Dữ Liệu Ngay</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Hỗ trợ kỹ thuật: Liên hệ đội ngũ DevOps hạ tầng Budgetly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
