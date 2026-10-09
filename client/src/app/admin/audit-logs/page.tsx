"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  ScrollText,
  Search,
  Filter,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  Terminal,
} from "lucide-react";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  severity: "Info" | "Warning" | "Danger" | "Critical";
  ipAddress: string;
  details: string;
}

const initialLogs: AuditLog[] = [
  {
    id: "LOG-8801",
    timestamp: "2026-10-06 19:42:10",
    actor: "Super Admin (lam23it138)",
    action: "CONFIG_UPDATE",
    target: "AI_THRESHOLD_SETTING",
    severity: "Info",
    ipAddress: "14.226.12.8",
    details: "Changed OCR Confidence Threshold from 0.85 to 0.90",
  },
  {
    id: "LOG-8802",
    timestamp: "2026-10-06 18:15:22",
    actor: "Moderator (hoa_mod)",
    action: "USER_LOCK",
    target: "user_fake99@gmail.com",
    severity: "Danger",
    ipAddress: "113.161.42.19",
    details: "Account locked after detecting fake transaction spam behavior",
  },
  {
    id: "LOG-8803",
    timestamp: "2026-10-06 15:00:00",
    actor: "SYSTEM_CRON",
    action: "DB_BACKUP",
    target: "PostgreSQL Production DB",
    severity: "Info",
    ipAddress: "127.0.0.1",
    details: "Automatic DB Snapshot backup succeeded (Size: 1.2 GB)",
  },
  {
    id: "LOG-8804",
    timestamp: "2026-10-06 12:10:45",
    actor: "Super Admin (lam23it138)",
    action: "ROLE_PERMISSION_CHANGE",
    target: "Finance Auditor Role",
    severity: "Warning",
    ipAddress: "14.226.12.8",
    details: "Added Export Data permission for the Finance Auditor role",
  },
  {
    id: "LOG-8805",
    timestamp: "2026-10-05 22:30:11",
    actor: "System Sentinel",
    action: "FAILED_LOGIN_ATTEMPT",
    target: "admin@budgetly.io",
    severity: "Critical",
    ipAddress: "185.220.101.5",
    details: "Detected 5 consecutive failed login attempts from an unknown IP (Tor exit node)",
  },
];

export default function AdminAuditLogsPage() {
  const [logs] = useState<AuditLog[]>(initialLogs);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === "All" || log.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="📝 Activity & Security Audit Logs"
        subtitle="Track all admin actions, configuration changes, and system security alerts"
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-2xl text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-2xl">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search actor, action, audit details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All severity levels</option>
              <option value="Info">Info (Normal)</option>
              <option value="Warning">Warning</option>
              <option value="Danger">Danger</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <button
            onClick={() => showNotification("Exported Audit Log archive (.log/.csv)")}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Download Log CSV</span>
          </button>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold text-slate-400">
                <tr>
                  <th className="px-6 py-4">Log ID & Time</th>
                  <th className="px-6 py-4">Actor Account</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Severity</th>
                  <th className="px-6 py-4">IP Address</th>
                  <th className="px-6 py-4">Action Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-indigo-400 font-bold">{log.id}</span>
                      <p className="text-slate-400 text-[10px] mt-0.5">{log.timestamp}</p>
                    </td>

                    <td className="px-6 py-4 font-semibold text-slate-200">{log.actor}</td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          log.severity === "Critical"
                            ? "bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse"
                            : log.severity === "Danger"
                            ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
                            : log.severity === "Warning"
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                            : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        }`}
                      >
                        {log.severity}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-400">{log.ipAddress}</td>

                    <td className="px-6 py-4 text-slate-300 font-sans">{log.details}</td>
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
