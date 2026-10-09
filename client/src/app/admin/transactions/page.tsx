"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Receipt,
  Search,
  AlertTriangle,
  Download,
  Filter,
  CheckCircle2,
  X,
  Eye,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
} from "lucide-react";

interface AdminTransaction {
  id: string;
  userName: string;
  userEmail: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  wallet: string;
  date: string;
  isFlagged: boolean;
  flagReason?: string;
}

const initialTransactions: AdminTransaction[] = [
  {
    id: "TX-9901",
    userName: "Nguyen Tung Lam",
    userEmail: "lam23it138@budgetly.io",
    description: "Unusually large ATM withdrawal",
    amount: 50000000,
    type: "expense",
    category: "Cash Withdrawal",
    wallet: "ATM Vietcombank",
    date: "2026-10-06 14:20",
    isFlagged: true,
    flagReason: "Amount > 30M VND in a single transaction",
  },
  {
    id: "TX-9902",
    userName: "Tran Minh Hoa",
    userEmail: "hoa.tran@gmail.com",
    description: "Received October salary bank transfer",
    amount: 25000000,
    type: "income",
    category: "Income / Salary",
    wallet: "Techcombank Wallet",
    date: "2026-10-06 09:15",
    isFlagged: false,
  },
  {
    id: "TX-9903",
    userName: "Vu Quoc Anh",
    userEmail: "spammer_spam99@temp-mail.com",
    description: "Rapidly paid 15 small Shopee invoices",
    amount: 150000,
    type: "expense",
    category: "Shopping",
    wallet: "MoMo Wallet",
    date: "2026-10-05 23:40",
    isFlagged: true,
    flagReason: "Suspected consecutive transaction spam bot",
  },
  {
    id: "TX-9904",
    userName: "Pham Khanh Linh",
    userEmail: "linh.pham@outlook.com",
    description: "September apartment electricity & water bill payment",
    amount: 1850000,
    type: "expense",
    category: "Bills & Utilities",
    wallet: "MB Bank Wallet",
    date: "2026-10-05 11:30",
    isFlagged: false,
  },
  {
    id: "TX-9905",
    userName: "Le Hoang Nam",
    userEmail: "nam.le99@yahoo.com",
    description: "Car refueling",
    amount: 850000,
    type: "expense",
    category: "Transport",
    wallet: "Cash Wallet",
    date: "2026-10-04 16:05",
    isFlagged: false,
  },
];

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<AdminTransaction[]>(initialTransactions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [flagFilter, setFlagFilter] = useState("All");
  const [selectedTx, setSelectedTx] = useState<AdminTransaction | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleFlag = (id: string) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === id) {
          const nextFlag = !tx.isFlagged;
          showNotification(
            `Transaction ${id} has been ${nextFlag ? "marked as suspicious" : "unflagged"}`
          );
          return {
            ...tx,
            isFlagged: nextFlag,
            flagReason: nextFlag ? "Manually flagged by Admin" : undefined,
          };
        }
        return tx;
      })
    );
  };

  const handleExportCSV = () => {
    showNotification("Transaction report (CSV) exported successfully!");
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(search.toLowerCase()) ||
      tx.userName.toLowerCase().includes(search.toLowerCase()) ||
      tx.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      tx.description.toLowerCase().includes(search.toLowerCase());

    const matchesType = typeFilter === "All" || tx.type === typeFilter;
    const matchesFlag =
      flagFilter === "All" ||
      (flagFilter === "Flagged" && tx.isFlagged) ||
      (flagFilter === "Normal" && !tx.isFlagged);

    return matchesSearch && matchesType && matchesFlag;
  });

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="💸 System-wide Transaction Management & Monitoring"
        subtitle="Track money flow, detect suspected fraud, and review transactions"
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
                placeholder="Search TX ID, user, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All (Income & Expense)</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <select
              value={flagFilter}
              onChange={(e) => setFlagFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All risk levels</option>
              <option value="Flagged">Suspected Fraud</option>
              <option value="Normal">Normal</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV Report</span>
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold text-slate-400">
                <tr>
                  <th className="px-6 py-4">TX ID & User</th>
                  <th className="px-6 py-4">Transaction Description</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Wallet / Method</th>
                  <th className="px-6 py-4">Risk Status</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-mono font-bold text-indigo-400">{tx.id}</span>
                        <p className="font-semibold text-slate-200 mt-0.5">{tx.userName}</p>
                        <p className="text-[11px] text-slate-400">{tx.userEmail}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-200">{tx.description}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {tx.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-sm">
                      <span
                        className={tx.type === "income" ? "text-emerald-400" : "text-slate-100"}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {tx.amount.toLocaleString("vi-VN")} ₫
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-300 font-medium">{tx.wallet}</td>

                    <td className="px-6 py-4">
                      {tx.isFlagged ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Suspected Fraud
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Normal
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">{tx.date}</td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleFlag(tx.id)}
                          className={`p-1.5 hover:bg-slate-800 rounded-lg transition-colors ${
                            tx.isFlagged ? "text-rose-400 hover:text-emerald-400" : "text-slate-400 hover:text-rose-400"
                          }`}
                          title={tx.isFlagged ? "Remove fraud flag" : "Flag as fraud risk"}
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>Transaction Details</span>
              <span className="font-mono text-xs text-indigo-400">{selectedTx.id}</span>
            </h3>

            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Performed By</span>
                <span className="font-semibold text-slate-200">{selectedTx.userName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Email</span>
                <span className="text-slate-300 font-mono">{selectedTx.userEmail}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Amount</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {selectedTx.amount.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Payment Wallet</span>
                <span className="text-slate-200">{selectedTx.wallet}</span>
              </div>
              {selectedTx.isFlagged && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/30 rounded-xl text-rose-300">
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> AI Alert Reason:
                  </p>
                  <p className="text-[11px] text-rose-200">{selectedTx.flagReason}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
