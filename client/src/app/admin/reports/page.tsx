"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  BarChart3,
  TrendingUp,
  Download,
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
      title: "Total Transaction Volume",
      value: "4.85B VND",
      growth: "+24.5%",
      icon: Receipt,
      color: "from-emerald-600 to-teal-600",
    },
    {
      title: "Premium Conversion Rate",
      value: "18.2%",
      growth: "+4.1%",
      icon: Users,
      color: "from-indigo-600 to-purple-600",
    },
    {
      title: "AI Invoice Scans",
      value: "14,890 scans",
      growth: "+32.8%",
      icon: Zap,
      color: "from-amber-600 to-orange-600",
    },
    {
      title: "Average Balance / User",
      value: "19.6M VND",
      growth: "+8.4%",
      icon: BarChart3,
      color: "from-blue-600 to-cyan-600",
    },
  ];

  const monthlyBreakdown = [
    { month: "May 2026", users: 850, volume: "2.8B", transactions: 28400, ocrScans: 6200 },
    { month: "June 2026", users: 940, volume: "3.2B", transactions: 31200, ocrScans: 7800 },
    { month: "July 2026", users: 1020, volume: "3.7B", transactions: 36800, ocrScans: 9500 },
    { month: "August 2026", users: 1150, volume: "4.1B", transactions: 41000, ocrScans: 11400 },
    { month: "September 2026", users: 1248, volume: "4.85B", transactions: 45890, ocrScans: 14890 },
  ];

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="📈 Advanced Reports & Analytics"
        subtitle="Analyze user growth, financial volume, and AI usage trends"
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-2xl text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-2xl">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">Time range:</span>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last quarter (90 days)</option>
              <option value="365">Full year 2026</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showNotification("Summary PDF report downloaded")}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Export PDF Report</span>
            </button>
            <button
              onClick={() => showNotification("Detailed data Excel file downloaded")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export Excel</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-semibold">{m.title}</span>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${m.color} text-white`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">{m.value}</h3>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {m.growth} vs last month
                </span>
              </div>
            );
          })}
        </div>

        {/* Monthly Breakdown Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 text-base">Monthly Growth Summary Table</h3>
            <p className="text-xs text-slate-400">Details of users, total money volume, and OCR scans by month</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold text-slate-400">
                <tr>
                  <th className="px-6 py-4">Period</th>
                  <th className="px-6 py-4">Users</th>
                  <th className="px-6 py-4">Total Money Volume</th>
                  <th className="px-6 py-4">Total Transactions</th>
                  <th className="px-6 py-4">AI OCR Scans</th>
                  <th className="px-6 py-4 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {monthlyBreakdown.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-850/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-indigo-300">{row.month}</td>
                    <td className="px-6 py-4 font-mono">{row.users.toLocaleString()} users</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">{row.volume}</td>
                    <td className="px-6 py-4 font-mono">{row.transactions.toLocaleString()} TX</td>
                    <td className="px-6 py-4 font-mono text-purple-400">{row.ocrScans.toLocaleString()} scans</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs">
                        <TrendingUp className="w-4 h-4" /> Good growth
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
