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
  { id: 1, description: "Team lunch at downtown cafe", amount: 45000, type: "expense", category: "Food & Dining", wallet: "Cash Wallet", date: "2026-09-24" },
  { id: 2, description: "Gas station refill", amount: 50000, type: "expense", category: "Transportation", wallet: "Bank Account", date: "2026-09-24" },
  { id: 3, description: "Monthly salary deposit", amount: 15000000, type: "income", category: "Salary & Income", wallet: "Bank Account", date: "2026-09-01" },
  { id: 4, description: "Online clothing order", amount: 350000, type: "expense", category: "Shopping", wallet: "Bank Account", date: "2026-09-23" },
  { id: 5, description: "Coffee meeting with teammates", amount: 65000, type: "expense", category: "Food & Dining", wallet: "E-Wallet", date: "2026-09-22" },
  { id: 6, description: "Mobile internet subscription", amount: 200000, type: "expense", category: "Utilities", wallet: "E-Wallet", date: "2026-09-20" },
];

const mockCategoryBreakdown = [
  { name: "Food & Dining", amount: 3450000, color: "bg-amber-500", icon: "🍲" },
  { name: "Transportation", amount: 850000, color: "bg-blue-500", icon: "🚗" },
  { name: "Shopping", amount: 2150000, color: "bg-purple-500", icon: "🛍️" },
  { name: "Entertainment", amount: 1100000, color: "bg-rose-500", icon: "🎬" },
  { name: "Utilities", amount: 700000, color: "bg-teal-500", icon: "⚡" },
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
    .reduce((sum, t) => sum + t.amount, 8250000);
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

        <main className="p-8 space-y-8 flex-1 overflow-y-auto">
          {/* Top Metric Cards */}
          <SummaryCards
            totalBalance={totalBalance}
            monthlyIncome={monthlyIncome}
            monthlyExpense={monthlyExpense}
            remainingBudget={remainingBudget}
          />

          {/* AI Intelligent NLP Input Bar */}
          <SmartAIInput onAddTransaction={handleAddTransaction} />

          {/* AI Spending Projection & Alert */}
          <AIForecastAlert
            monthlyExpense={monthlyExpense}
            monthlyBudget={monthlyBudget}
          />

          {/* Dashboard Visuals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RecentTransactions
                transactions={transactions}
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
            <div>
              <ExpenseBreakdownChart
                categories={mockCategoryBreakdown}
                totalExpense={monthlyExpense}
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
