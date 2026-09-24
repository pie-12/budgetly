"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import SummaryCards from "@/components/dashboard/SummaryCards";
import SmartAIInput from "@/components/dashboard/SmartAIInput";
import AIForecastAlert from "@/components/dashboard/AIForecastAlert";
import ExpenseBreakdownChart from "@/components/dashboard/ExpenseBreakdownChart";
import RecentTransactions, { Transaction } from "@/components/dashboard/RecentTransactions";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import OCRScanModal from "@/components/modals/OCRScanModal";

const initialTransactions: Transaction[] = [
  { id: 1, description: "Ăn phở trưa cùng đồng nghiệp", amount: 45000, type: "expense", category: "Ăn uống", wallet: "Ví tiền mặt", date: "2026-09-24" },
  { id: 2, description: "Đổ xăng xe máy", amount: 50000, type: "expense", category: "Di chuyển", wallet: "ATM Vietcombank", date: "2026-09-24" },
  { id: 3, description: "Nhận lương tháng 9/2026", amount: 15000000, type: "income", category: "Thu nhập / Lương", wallet: "ATM Vietcombank", date: "2026-09-01" },
  { id: 4, description: "Mua sắm quần áo ở Shopee", amount: 350000, type: "expense", category: "Mua sắm", wallet: "ATM Vietcombank", date: "2026-09-23" },
  { id: 5, description: "Uống cà phê họp nhóm", amount: 65000, type: "expense", category: "Ăn uống", wallet: "Ví MoMo", date: "2026-09-22" },
  { id: 6, description: "Thanh toán tiền điện thoại", amount: 200000, type: "expense", category: "Tiện ích", wallet: "Ví MoMo", date: "2026-09-20" },
];

const mockCategoryBreakdown = [
  { name: "Ăn uống", amount: 3450000, color: "bg-amber-500", icon: "🍲" },
  { name: "Di chuyển", amount: 850000, color: "bg-blue-500", icon: "🚗" },
  { name: "Mua sắm", amount: 2150000, color: "bg-purple-500", icon: "🛍️" },
  { name: "Giải trí", amount: 1100000, color: "bg-rose-500", icon: "🎬" },
  { name: "Tiện ích", amount: 700000, color: "bg-teal-500", icon: "⚡" },
];

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOCRModalOpen, setIsOCRModalOpen] = useState(false);

  // Financial Summary Aggregations
  const totalBalance = 24500000;
  const monthlyIncome = 15000000;
  const monthlyExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 8250000); // Baseline + new items
  const monthlyBudget = 15000000;
  const remainingBudget = Math.max(monthlyBudget - monthlyExpense, 0);

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
  };

  const handleDeleteTransaction = (id: number | string) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenAddModal={() => setIsAddModalOpen(true)}
          onOpenOCRModal={() => setIsOCRModalOpen(true)}
        />

        <main className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          {/* Section 1: Summary Indicator Cards */}
          <SummaryCards
            totalBalance={totalBalance}
            monthlyIncome={monthlyIncome}
            monthlyExpense={monthlyExpense}
            remainingBudget={remainingBudget}
          />

          {/* Section 2: Core Feature - Smart AI Natural Text Input Bar (FR-08) */}
          <SmartAIInput onAddTransaction={handleAddTransaction} />

          {/* Section 3: Core Feature - AI Financial Forecast & Budget Warning (FR-10) */}
          <AIForecastAlert
            monthlyExpense={monthlyExpense}
            monthlyBudget={monthlyBudget}
          />

          {/* Section 4: Analytics Chart & Recent Transactions Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ExpenseBreakdownChart
                categories={mockCategoryBreakdown}
                totalExpense={monthlyExpense}
              />
            </div>
            <div className="lg:col-span-2">
              <RecentTransactions
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
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
    </div>
  );
}
