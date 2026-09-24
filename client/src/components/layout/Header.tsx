"use client";

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenOCRModal: () => void;
}

export default function Header({ onOpenAddModal, onOpenOCRModal }: HeaderProps) {
  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search / Context Title */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-100 tracking-tight">
          Tổng quan Tài chính
        </h2>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Tháng 09 / 2026
        </span>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-3">
        {/* OCR Receipt Scan Button */}
        <button
          onClick={onOpenOCRModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700/80 transition-all shadow-sm active:scale-95"
        >
          <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>📷 Quét Hóa đơn OCR</span>
        </button>

        {/* Manual Add Transaction Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/25 active:scale-95"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>+ Thêm Giao dịch</span>
        </button>
      </div>
    </header>
  );
}
