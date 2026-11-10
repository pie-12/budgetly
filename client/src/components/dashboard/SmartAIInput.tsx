"use client";

import { useState } from "react";
import {
  api,
  ApiCategory,
  ApiSmartInputResult,
  ApiWallet,
  getErrorMessage,
  toNumber,
} from "@/services/api";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface SmartAIInputProps {
  wallets: ApiWallet[];
  categories: ApiCategory[];
  onCreated?: () => void;
}

export default function SmartAIInput({ wallets, categories, onCreated }: SmartAIInputProps) {
  const { t, language } = useLanguage();
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ApiSmartInputResult | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setExtractedData(null);
    try {
      const response = await api.smartInput(inputText.trim());
      setExtractedData(response.data);
    } catch (err) {
      setError(getErrorMessage(err, language === "vi" ? "Không thể phân tích dữ liệu nhập" : "Failed to analyze input text"));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmSave = async () => {
    if (!extractedData) return;

    const wallet =
      wallets.find(
        (item) =>
          item.name.toLowerCase() === (extractedData.suggested_wallet || "").toLowerCase()
      ) ?? wallets[0];
    if (!wallet) {
      setError(language === "vi" ? "Vui lòng tạo ít nhất 1 ví tài chính trước khi lưu giao dịch từ AI." : "Please create at least 1 wallet before saving AI transactions.");
      return;
    }

    const category = categories.find(
      (item) => item.name.toLowerCase() === extractedData.category.toLowerCase()
    );

    setIsSaving(true);
    setError(null);
    try {
      await api.createTransaction({
        wallet_id: wallet.id,
        category_id: category?.id ?? null,
        amount: toNumber(extractedData.amount),
        transaction_type: extractedData.type,
        description: extractedData.description,
        transaction_date: new Date().toISOString(),
        input_method: "NLP",
        ai_confidence_score: extractedData.confidence_score,
      });
      setExtractedData(null);
      setInputText("");
      onCreated?.();
    } catch (err) {
      setError(getErrorMessage(err, language === "vi" ? "Không thể lưu giao dịch từ AI" : "Failed to save AI transaction"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-white to-white dark:from-emerald-950/25 dark:via-slate-900 dark:to-slate-900 border border-emerald-200/80 dark:border-emerald-500/30 backdrop-blur-md relative overflow-hidden shadow-xs hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
            <Sparkles className="w-4 h-4" strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
              {language === "vi" ? "Nhập liệu bằng ngôn ngữ tự nhiên (AI NLP)" : "Smart natural language input (AI NLP)"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === "vi" ? (
                <>Gõ tự nhiên như nói chuyện (ví dụ: <span className="text-emerald-600 dark:text-emerald-400/90 font-medium italic">"Ăn trưa phở bò 45k"</span> hoặc <span className="text-emerald-600 dark:text-emerald-400/90 font-medium italic">"Đổ xăng 50k"</span>)</>
              ) : (
                <>Type naturally (e.g. <span className="text-emerald-600 dark:text-emerald-400/90 font-medium italic">"Lunch pho 45k"</span> or <span className="text-emerald-600 dark:text-emerald-400/90 font-medium italic">"Gas station 50k"</span>)</>
              )}
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/30">
          {language === "vi" ? "Phân loại NLP sẵn sàng" : "NLP Classifier Active"}
        </span>
      </div>

      {/* Input Form */}
      <form onSubmit={handleAnalyze} className="relative flex items-center">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t("ai_input_placeholder")}
          className="w-full bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 pr-28 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
        />
        <button
          type="submit"
          disabled={isAnalyzing || !inputText.trim()}
          className="absolute right-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white transition-all flex items-center gap-1.5 shadow-xs active:scale-95 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{language === "vi" ? "Phân tích..." : "Parsing..."}</span>
            </>
          ) : (
            <>
              <span>{language === "vi" ? "Trích xuất" : "Extract"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-3.5 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.8} />
          <span>{error}</span>
        </div>
      )}

      {/* Extracted Card Confirmation */}
      {extractedData && (
        <div className="mt-4 p-4 rounded-xl bg-white dark:bg-slate-950/90 border border-emerald-300 dark:border-emerald-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm animate-in fade-in duration-300">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                {language === "vi" ? "AI nhận diện:" : "AI Extracted:"}
              </span>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                {(extractedData.confidence_score * 100).toFixed(0)}% {language === "vi" ? "độ chính xác" : "Confidence"}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              "{extractedData.description}"
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400 pt-0.5">
              <span>{language === "vi" ? "Số tiền" : "Amount"}: <b className="text-slate-900 dark:text-slate-100">{toNumber(extractedData.amount).toLocaleString("vi-VN")} ₫</b></span>
              <span>•</span>
              <span>{language === "vi" ? "Danh mục" : "Category"}: <b className="text-emerald-600 dark:text-emerald-400">{extractedData.category}</b></span>
              <span>•</span>
              <span>{language === "vi" ? "Ví gợi ý" : "Wallet"}: <b className="text-slate-800 dark:text-slate-200">{extractedData.suggested_wallet || (language === "vi" ? "Tự động" : "Auto")}</b></span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setExtractedData(null)}
              className="flex-1 md:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700/60 cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleConfirmSave}
              disabled={isSaving}
              className="flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white transition-all shadow-xs active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{language === "vi" ? "Đang lưu..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === "vi" ? "Xác nhận & lưu" : "Confirm & save"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
