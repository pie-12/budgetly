"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenAddModal={() => {}} onOpenOCRModal={() => {}} />
        <main className="flex-1 p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Cài đặt Hồ sơ & Hệ thống</h2>
            <p className="text-xs text-slate-400 mt-1">Quản lý thông tin tài khoản và tùy chỉnh ứng dụng</p>
          </div>

          <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-2">Hồ sơ cá nhân</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Họ và tên</label>
                  <input
                    type="text"
                    defaultValue="Nguyễn Tùng Lâm"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="lam23it138@budgetly.io"
                    className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-200 text-sm border-b border-slate-800 pb-2">Tùy chỉnh AI</h3>
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">Tự động phân loại bằng AI NLP</span>
                  <p className="text-slate-500">Phân tích câu tự nhiên tiếng Việt và tự gắn danh mục</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200">Cảnh báo chi tiêu AI chủ động</span>
                  <p className="text-slate-500">Phát thông báo khi có nguy cơ vượt 90% hạn mức ngân sách</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500" />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30">
                Lưu Thay đổi
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
