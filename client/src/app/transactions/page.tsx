"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import RecentTransactions, { Transaction } from "@/components/dashboard/RecentTransactions";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import OCRScanModal from "@/components/modals/OCRScanModal";

const initialTransactions: Transaction[] = [
  { id: 1, description: "Ăn bún chả trưa", amount: 45000, type: "expense", category: "Ăn uống", wallet: "Ví tiền mặt", date: "2026-09-24" },
  { id: 2, description: "Đổ xăng xe máy", amount: 50000, type: "expense", category: "Di chuyển", wallet: "ATM Vietcombank", date: "2026-09-23" },
  { id: 3, description: "Nhận lương tháng 9", amount: 15000000, type: "income", category: "Thu nhập / Lương", wallet: "ATM Vietcombank", date: "2026-09-01" },
  { id: 4, description: "Mua trà sữa GongCha", amount: 65000, type: "expense", category: "Ăn uống", wallet: "Ví MoMo", date: "2026-09-22" },
  { id: 5, description: "Thanh toán tiền điện thoại", amount: 200000, type: "expense", category: "Tiện ích", wallet: "Ví MoMo", date: "2026-09-20" },
  { id: 6, description: "Mua quần áo mới ở Shopee", amount: 450000, type: "expense", category: "Mua sắm", wallet: "ATM Vietcombank", date: "2026-09-18" },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
  };

  const handleDeleteTransaction = (id: number | string) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenOCRModal={() => setIsOCRModalOpen(true)}
        />
        <main className="flex-1 p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Quản lý Giao dịch Chi tiết</h2>
            <p className="text-xs text-slate-400 mt-1">
              Xem toàn bộ lịch sử thu/chi, lọc theo loại, ngày tháng và tìm kiếm từ khóa
            </p>
          </div>

          <div className="h-[600px]">
            <RecentTransactions
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>

          <AddTransactionModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddTransaction={handleAddTransaction}
          />

          <OCRScanModal
            isOpen={isOCRModalOpen}
            onClose={() => setIsOCRModalOpen(false)}
            onAddTransaction={handleAddTransaction}
          />
        </main>
      </div>
    </div>
  );
}
