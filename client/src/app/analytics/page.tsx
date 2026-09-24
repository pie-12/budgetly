"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenAddModal={() => {}} onOpenOCRModal={() => {}} />
        <main className="flex-1 p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Báo cáo & Thống kê Tài chính</h2>
            <p className="text-xs text-slate-400 mt-1">Trực quan hóa tỷ trọng chi tiêu và biến động dòng tiền theo thời gian</p>
          </div>

          {/* Analytics Visual Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-200 text-sm">Biểu đồ Phân bổ Chi tiêu (Category Pie)</h3>
              <div className="h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                📊 Visual Category Chart (Ăn uống 45%, Mua sắm 25%, Di chuyển 15%, Khác 15%)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-200 text-sm">Xu hướng Thu vs. Chi (Cashflow Trend)</h3>
              <div className="h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                📈 Monthly Income vs Expense Line Chart
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
