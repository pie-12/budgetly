"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Target,
  AlertTriangle,
  CheckCircle2,
  BellRing,
  Settings,
  ShieldCheck,
  TrendingUp,
  X,
  Send,
} from "lucide-react";

interface UserBudgetMonitor {
  id: string;
  userName: string;
  userEmail: string;
  budgetName: string;
  allocatedAmount: number;
  spentAmount: number;
  percentageUsed: number;
  status: "Normal" | "Warning" | "Exceeded";
}

const initialBudgets: UserBudgetMonitor[] = [
  {
    id: "BDG-01",
    userName: "Nguyen Tung Lam",
    userEmail: "lam23it138@budgetly.io",
    budgetName: "Monthly Food & Dining",
    allocatedAmount: 5000000,
    spentAmount: 4850000,
    percentageUsed: 97,
    status: "Warning",
  },
  {
    id: "BDG-02",
    userName: "Tran Minh Hoa",
    userEmail: "hoa.tran@gmail.com",
    budgetName: "Device Shopping",
    allocatedAmount: 10000000,
    spentAmount: 11200000,
    percentageUsed: 112,
    status: "Exceeded",
  },
  {
    id: "BDG-03",
    userName: "Pham Khanh Linh",
    userEmail: "linh.pham@outlook.com",
    budgetName: "Entertainment & Travel",
    allocatedAmount: 15000000,
    spentAmount: 6200000,
    percentageUsed: 41,
    status: "Normal",
  },
  {
    id: "BDG-04",
    userName: "Le Hoang Nam",
    userEmail: "nam.le99@yahoo.com",
    budgetName: "Transportation Costs",
    allocatedAmount: 2000000,
    spentAmount: 1950000,
    percentageUsed: 97.5,
    status: "Warning",
  },
];

export default function AdminBudgetsPage() {
  const [budgets] = useState<UserBudgetMonitor[]>(initialBudgets);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Config limits state
  const [freeTierLimit, setFreeTierLimit] = useState(15000000);
  const [premiumTierLimit, setPremiumTierLimit] = useState(100000000);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendNudge = (userEmail: string, budgetName: string) => {
    showNotification(`Budget overrun reminder sent to ${userEmail}`);
  };

  const handleSaveTierLimits = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification("System budget limit configuration updated!");
  };

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="🎯 Budget & System Limit Management"
        subtitle="Monitor user budget overruns and configure account limits"
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-2xl text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Global Limits Configuration Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Default Budget Limits by Plan</h3>
              <p className="text-xs text-slate-400">Set the maximum budget cap allowed by the system</p>
            </div>
          </div>

          <form onSubmit={handleSaveTierLimits} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Free Tier - Monthly cap
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={freeTierLimit}
                  onChange={(e) => setFreeTierLimit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">
                  VND
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Premium Tier - Monthly cap
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={premiumTierLimit}
                  onChange={(e) => setPremiumTierLimit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-bold">
                  VND
                </span>
              </div>
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
              >
                Save Limit Configuration
              </button>
            </div>
          </form>
        </div>

        {/* User Budget Health Monitor Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 text-base">Realtime User Budget Monitoring</h3>
            <p className="text-xs text-slate-400">Budgets that reached the warning threshold (&gt;90%)</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold text-slate-400">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Budget Name</th>
                  <th className="px-6 py-4">Allocated Limit</th>
                  <th className="px-6 py-4">Spent</th>
                  <th className="px-6 py-4">Usage Rate</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Reminder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {budgets.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-200">{b.userName}</span>
                      <p className="text-[11px] text-slate-400">{b.userEmail}</p>
                    </td>

                    <td className="px-6 py-4 font-medium text-indigo-300">{b.budgetName}</td>

                    <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                      {b.allocatedAmount.toLocaleString("vi-VN")} ₫
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-slate-100">
                      {b.spentAmount.toLocaleString("vi-VN")} ₫
                    </td>

                    <td className="px-6 py-4">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span
                            className={
                              b.percentageUsed >= 100
                                ? "text-rose-400"
                                : b.percentageUsed >= 90
                                ? "text-amber-400"
                                : "text-emerald-400"
                            }
                          >
                            {b.percentageUsed}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              b.percentageUsed >= 100
                                ? "bg-rose-500"
                                : b.percentageUsed >= 90
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(b.percentageUsed, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          b.status === "Exceeded"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : b.status === "Warning"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        }`}
                      >
                        {b.status === "Exceeded" ? "Over Limit" : b.status === "Warning" ? "Warning" : "Safe"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleSendNudge(b.userEmail, b.budgetName)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 rounded-lg text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1 ml-auto"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Nudge</span>
                      </button>
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
