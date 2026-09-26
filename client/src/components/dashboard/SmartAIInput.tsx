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
        category: "Food & Dining",
        wallet: "Cash Wallet",
        date: new Date().toISOString().split("T")[0],
        confidence: 0.94,
      };

      const textLower = inputText.toLowerCase();
      if (textLower.includes("gas") || textLower.includes("fuel") || textLower.includes("uber") || textLower.includes("taxi")) {
        parsed.category = "Transportation";
        parsed.amount = 50000;
      } else if (textLower.includes("amazon") || textLower.includes("shirt") || textLower.includes("shoes") || textLower.includes("shop")) {
        parsed.category = "Shopping";
        parsed.amount = 250000;
      } else if (textLower.includes("salary") || textLower.includes("bonus") || textLower.includes("income")) {
        parsed.category = "Salary & Income";
        parsed.amount = 15000000;
      }

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
    }, 800);
  };

  const handleConfirmSave = () => {
    if (!extractedData) return;
    onAddTransaction({
      id: Date.now(),
      description: extractedData.description,
      amount: extractedData.amount,
      type: extractedData.category === "Salary & Income" ? "income" : "expense",
      category: extractedData.category,
      wallet: extractedData.wallet,
      date: extractedData.date,
    });
    setExtractedData(null);
    setInputText("");
  };

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 backdrop-blur-md relative overflow-hidden shadow-xl">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            ✨
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm md:text-base">
              AI Smart Input (Natural Language)
            </h3>
            <p className="text-xs text-slate-400">
              Type naturally (e.g. <span className="text-emerald-400/90 italic">"Bought lunch for $5.50"</span> or <span className="text-emerald-400/90 italic">"Spent $20 on gas"</span>)
            </p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
          NLP Classifier Active
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="relative flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="E.g., Bought lunch with coffee 50k..."
          className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3.5 pr-28 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={isAnalyzing || !inputText.trim()}
          className="absolute right-2 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-slate-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Parsing...
            </>
          ) : (
            <>
              <span>Extract</span>
              <span>→</span>
            </>
          )}
        </button>
      </form>

      {/* Extracted Card Confirmation */}
      {extractedData && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950/90 border border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
                AI Detected:
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {(extractedData.confidence * 100).toFixed(0)}% Confidence
              </span>
            </div>
            <div className="text-sm font-medium text-slate-200">
              "{extractedData.description}"
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-400 pt-1">
              <span>Amount: <b className="text-slate-100">{extractedData.amount.toLocaleString()} ₫</b></span>
              <span>•</span>
              <span>Category: <b className="text-emerald-400">{extractedData.category}</b></span>
              <span>•</span>
              <span>Wallet: <b className="text-slate-200">{extractedData.wallet}</b></span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setExtractedData(null)}
              className="flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all border border-slate-700/60"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSave}
              className="flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Confirm & Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
