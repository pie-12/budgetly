"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import RecentTransactions, { Transaction } from "@/components/dashboard/RecentTransactions";
import AddTransactionModal from "@/components/modals/AddTransactionModal";
import OCRScanModal from "@/components/modals/OCRScanModal";

const initialTransactions: Transaction[] = [
  { id: 1, description: "Traditional lunch with coworkers", amount: 45000, type: "expense", category: "Food & Dining", wallet: "Cash Wallet", date: "2026-09-24" },
  { id: 2, description: "Motorbike gas refill", amount: 50000, type: "expense", category: "Transportation", wallet: "Bank Account", date: "2026-09-23" },
  { id: 3, description: "Monthly salary deposit", amount: 15000000, type: "income", category: "Salary & Income", wallet: "Bank Account", date: "2026-09-01" },
  { id: 4, description: "Milk tea drink order", amount: 65000, type: "expense", category: "Food & Dining", wallet: "E-Wallet", date: "2026-09-22" },
  { id: 5, description: "Mobile internet renewal", amount: 200000, type: "expense", category: "Utilities", wallet: "E-Wallet", date: "2026-09-20" },
  { id: 6, description: "Online sportswear shopping", amount: 450000, type: "expense", category: "Shopping", wallet: "Bank Account", date: "2026-09-18" },
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
            <h2 className="text-2xl font-bold text-slate-100">Transaction Management</h2>
            <p className="text-xs text-slate-400 mt-1">
              Complete history of financial ledger entries with instant filtering and search
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
