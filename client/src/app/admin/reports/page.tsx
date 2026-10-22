"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Users,
  Receipt,
  Zap,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
} from "lucide-react";

export default function AdminReportsPage() {
  const [timeRange, setTimeRange] = useState("30");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const metrics = [
    {
      title: "Tổng Luân Chuyển Tiền Tệ",
      value: "4.85 tỷ ₫",
      growth: "+24.5%",
      icon: Receipt,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "Tỷ Lệ Đổi Sang Gói Premium",
      value: "18.2%",
      growth: "+4.1%",
      icon: Users,
      color: "from-indigo-600 to-purple-600",
    },
    {
      title: "Lượt Quét Hóa Đơn AI",
      value: "14,890 lượt",
      growth: "+32.8%",
      icon: Zap,
      color: "from-amber-600 to-orange-600",
    },
    {
      title: "Số Dư Bình Quân / Người Dùng",
      value: "19.6 triệu ₫",
      growth: "+8.4%",
      icon: BarChart3,
      color: "from-blue-600 to-cyan-600",
    },
  ];

  const monthlyBreakdown = [
    { month: "Tháng 05/2026", users: 850, volume: "2.8 tỷ ₫", transactions: 28400, ocrScans: 6200 },
    { month: "Tháng 06/2026", users: 940, volume: "3.2 tỷ ₫", transactions: 31200, ocrScans: 7800 },
    { month: "Tháng 07/2026", users: 1020, volume: "3.7 tỷ ₫", transactions: 36800, ocrScans: 9500 },
    { month: "Tháng 08/2026", users: 1150, volume: "4.1 tỷ ₫", transactions: 41000, ocrScans: 11400 },
    { month: "Tháng 09/2026", users: 1248, volume: "4.85 tỷ ₫", transactions: 45890, ocrScans: 14890 },
  ];

  return (
    <div className="flex-1 pb-12 font-sans transition-colors duration-200">
      <AdminHeader
        title="Báo Cáo & Phân Tích Chuyên Sâu"
        subtitle="Phân tích tăng trưởng người dùng, luồng tiền tài chính và xu hướng sử dụng AI toàn hệ thống"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-xl shadow-lg text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Khoảng thời gian:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="7">7 ngày gần nhất</option>
              <option value="30">30 ngày gần nhất</option>
              <option value="90">Quý gần nhất (90 ngày)</option>
              <option value="365">Toàn bộ năm 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showNotification("Đã tải xuống tệp báo cáo PDF tổng hợp")}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Xuất Báo Cáo PDF</span>
            </button>
            <button
              onClick={() => showNotification("Đã xuất tệp dữ liệu chi tiết Excel")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Xuất Excel</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs relative overflow-hidden group transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{m.title}</span>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${m.color} text-white`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{m.value}</h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {m.growth} so với tháng trước
                </span>
              </div>
            );
          })}
        </div>

        {/* Monthly Breakdown Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Bảng Tổng Hợp Tăng Trưởng Hàng Tháng</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Chi tiết số người dùng, tổng tiền luân chuyển và lượt quét OCR theo từng tháng</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">Kỳ Báo Cáo</th>
                  <th className="px-6 py-4">Người Dùng</th>
                  <th className="px-6 py-4">Tổng Luồng Tiền</th>
                  <th className="px-6 py-4">Số Lượng Giao Dịch</th>
                  <th className="px-6 py-4">Lượt Quét OCR</th>
                  <th className="px-6 py-4 text-right">Đánh Giá</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {monthlyBreakdown.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-slate-100">{row.month}</td>
                    <td className="px-6 py-4 font-mono">{row.users.toLocaleString()} tài khoản</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{row.volume}</td>
                    <td className="px-6 py-4 font-mono">{row.transactions.toLocaleString()} TX</td>
                    <td className="px-6 py-4 font-mono text-purple-600 dark:text-purple-400">{row.ocrScans.toLocaleString()} lượt</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                        <TrendingUp className="w-3.5 h-3.5" /> Tăng trưởng tốt
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
