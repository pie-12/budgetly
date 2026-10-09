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
    userName: "Nguyễn Tùng Lâm",
    userEmail: "lam23it138@budgetly.io",
    description: "Rút tiền ATM hạn mức lớn bất thường",
    amount: 50000000,
    type: "expense",
    category: "Rút tiền mặt",
    wallet: "ATM Vietcombank",
    date: "2026-10-06 14:20",
    isFlagged: true,
    flagReason: "Số tiền > 30 triệu VNĐ trong 1 giao dịch đơn",
  },
  {
    id: "TX-9902",
    userName: "Trần Minh Hòa",
    userEmail: "hoa.tran@gmail.com",
    description: "Nhận tiền chuyển khoản lương tháng 10",
    amount: 25000000,
    type: "income",
    category: "Thu nhập / Lương",
    wallet: "Ví Techcombank",
    date: "2026-10-06 09:15",
    isFlagged: false,
  },
  {
    id: "TX-9903",
    userName: "Vũ Quốc Anh",
    userEmail: "spammer_spam99@temp-mail.com",
    description: "Thanh toán liên tục 15 hóa đơn nhỏ Shopee",
    amount: 150000,
    type: "expense",
    category: "Mua sắm",
    wallet: "Ví MoMo",
    date: "2026-10-05 23:40",
    isFlagged: true,
    flagReason: "Nghi vấn spam bot giao dịch liên tiếp",
  },
  {
    id: "TX-9904",
    userName: "Phạm Khánh Linh",
    userEmail: "linh.pham@outlook.com",
    description: "Đóng tiền điện & nước căn hộ tháng 9",
    amount: 1850000,
    type: "expense",
    category: "Hóa đơn & Tiện ích",
    wallet: "Ví MB Bank",
    date: "2026-10-05 11:30",
    isFlagged: false,
  },
  {
    id: "TX-9905",
    userName: "Lê Hoàng Nam",
    userEmail: "nam.le99@yahoo.com",
    description: "Đổ xăng xe ô tô",
    amount: 850000,
    type: "expense",
    category: "Di chuyển",
    wallet: "Ví tiền mặt",
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
            `Giao dịch ${id} đã được ${nextFlag ? "đánh dấu nghi vấn" : "bỏ đánh dấu gian lận"}`
          );
          return {
            ...tx,
            isFlagged: nextFlag,
            flagReason: nextFlag ? "Được đánh dấu thủ công bởi Admin" : undefined,
          };
        }
        return tx;
      })
    );
  };

  const handleExportCSV = () => {
    showNotification("Đã xuất file báo cáo giao dịch (CSV) thành công!");
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
        title="💸 Quản Lý & Giám Sát Giao Dịch Toàn Hệ Thống"
        subtitle="Theo dõi luồng tiền, phát hiện nghi vấn gian lận và kiểm duyệt giao dịch"
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
                placeholder="Tìm mã TX, người dùng, mô tả..."
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
              <option value="All">Tất cả (Thu & Chi)</option>
              <option value="expense">Khoản Chi (Expense)</option>
              <option value="income">Khoản Thu (Income)</option>
            </select>

            <select
              value={flagFilter}
              onChange={(e) => setFlagFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">Tất cả rủi ro</option>
              <option value="Flagged">Cảnh báo nghi vấn (Fraud)</option>
              <option value="Normal">Bình thường</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Xuất Báo Cáo CSV</span>
          </button>
        </div>

        {/* Transactions Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold text-slate-400">
                <tr>
                  <th className="px-6 py-4">Mã TX & Người dùng</th>
                  <th className="px-6 py-4">Mô tả giao dịch</th>
                  <th className="px-6 py-4">Số tiền</th>
                  <th className="px-6 py-4">Ví / Phương thức</th>
                  <th className="px-6 py-4">Trạng thái rủi ro</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
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
                          Nghi vấn Fraud
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Bình thường
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">{tx.date}</td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleToggleFlag(tx.id)}
                          className={`p-1.5 hover:bg-slate-800 rounded-lg transition-colors ${
                            tx.isFlagged ? "text-rose-400 hover:text-emerald-400" : "text-slate-400 hover:text-rose-400"
                          }`}
                          title={tx.isFlagged ? "Bỏ cờ gian lận" : "Đánh dấu rủi ro fraud"}
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
              <span>Chi Tiết Giao Dịch</span>
              <span className="font-mono text-xs text-indigo-400">{selectedTx.id}</span>
            </h3>

            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Người thực hiện</span>
                <span className="font-semibold text-slate-200">{selectedTx.userName}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Email</span>
                <span className="text-slate-300 font-mono">{selectedTx.userEmail}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Số tiền</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {selectedTx.amount.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Ví thanh toán</span>
                <span className="text-slate-200">{selectedTx.wallet}</span>
              </div>
              {selectedTx.isFlagged && (
                <div className="p-3 bg-rose-950/60 border border-rose-500/30 rounded-xl text-rose-300">
                  <p className="font-bold flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-400" /> Lý Do Cảnh Báo AI:
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
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
