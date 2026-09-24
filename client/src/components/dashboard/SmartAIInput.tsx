"use client";

import { useState } from "react";

interface SmartAIInputProps {
  onAddTransaction: (newTx: any) => void;
}

export default function SmartAIInput({ onAddTransaction }: SmartAIInputProps) {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setExtractedData(null);

    // Simulate AI NLP parsing response
    setTimeout(() => {
      let parsed = {
        description: inputText,
        amount: 50000,
        category: "Ăn uống",
        wallet: "Ví tiền mặt",
        date: new Date().toISOString().split("T")[0],
        confidence: 0.94,
      };

      const textLower = inputText.toLowerCase();
      if (textLower.includes("xăng") || textLower.includes("xe")) {
        parsed.category = "Di chuyển";
        parsed.amount = 50000;
      } else if (textLower.includes("shopee") || textLower.includes("áo") || textLower.includes("quần")) {
        parsed.category = "Mua sắm";
        parsed.amount = 250000;
      } else if (textLower.includes("lương") || textLower.includes("thưởng")) {
        parsed.category = "Thu nhập / Lương";
        parsed.amount = 15000000;
      }

      // Try extract numbers from string
      const numberMatches = inputText.match(/\d+/g);
      if (numberMatches) {
        let numStr = numberMatches.join("");
        let val = parseInt(numStr, 10);
        if (inputText.includes("k") || inputText.includes("K")) {
          val = val * 1000;
        }
        if (val > 0) parsed.amount = val;
      }

      setExtractedData(parsed);
      setIsAnalyzing(false);
    }, 900);
  };

  const handleConfirmSave = () => {
    if (!extractedData) return;
    onAddTransaction({
      id: Date.now(),
      description: extractedData.description,
      amount: extractedData.amount,
      type: extractedData.category.includes("Thu nhập") ? "income" : "expense",
      category: extractedData.category,
      wallet: extractedData.wallet,
      date: extractedData.date,
    });

    setInputText("");
    setExtractedData(null);
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 shadow-xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base border border-emerald-500/30">
            🪄
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Smart AI Input (NLP)
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Core AI Feature
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Nhập câu thoại tự nhiên Tiếng Việt (VD: <span className="text-emerald-300 italic">"Vừa đổ xăng 50k"</span>, <span className="text-emerald-300 italic">"Ăn phở trưa 45.000đ"</span>)
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="flex items-center gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ví dụ: Vừa chuyển khoản 150k tiền cà phê họp nhóm ngày hôm qua..."
            className="w-full px-5 py-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 text-sm transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isAnalyzing || !inputText.trim()}
          className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50 transition-all active:scale-95 whitespace-nowrap"
        >
          {isAnalyzing ? (
            <>
              <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Đang phân tích AI...</span>
            </>
          ) : (
            <>
              <span>Phân tích AI</span>
              <span>✨</span>
            </>
          )}
        </button>
      </form>

      {/* Extracted AI Result Dialog Banner */}
      {extractedData && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 animate-fade-in flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Độ tin cậy AI: {(extractedData.confidence * 100).toFixed(0)}%
            </div>
            <div className="space-y-0.5">
              <p className="text-slate-300 font-medium">
                Mô tả: <span className="font-bold text-white">{extractedData.description}</span>
              </p>
              <div className="flex items-center gap-3 text-slate-400">
                <span>Số tiền: <strong className="text-emerald-400">{extractedData.amount.toLocaleString("vi-VN")} ₫</strong></span>
                <span>•</span>
                <span>Danh mục: <strong className="text-slate-200">{extractedData.category}</strong></span>
                <span>•</span>
                <span>Ngày: <strong className="text-slate-200">{extractedData.date}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExtractedData(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700 hover:bg-slate-700"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmSave}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30"
            >
              ✓ Xác nhận & Lưu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
