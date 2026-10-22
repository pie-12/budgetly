"use client";

import { useState } from "react";
import {
  api,
  ApiCategory,
  ApiOcrResult,
  ApiWallet,
  getErrorMessage,
  toNumber,
  TransactionPayload,
} from "@/services/api";
import { ScanLine, UploadCloud, X, AlertCircle, Loader2, Sparkles, CheckCircle2 } from "lucide-react";

interface OCRScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
  wallets: ApiWallet[];
  categories: ApiCategory[];
}

export default function OCRScanModal({
  isOpen,
  onClose,
  onCreated,
  wallets,
  categories,
}: OCRScanModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [ocrResult, setOcrResult] = useState<ApiOcrResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setSelectedFile(file);
      setOcrResult(null);
      setError(null);
    }
  };

  const handleScanReceipt = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    setError(null);
    try {
      const response = await api.scanReceipt(selectedFile);
      setOcrResult(response.data);
    } catch (err) {
      setError(getErrorMessage(err, "Không thể quét và đọc hóa đơn"));
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveOCRResult = async () => {
    if (!ocrResult) return;

    const wallet = wallets[0];
    if (!wallet) {
      setError("Vui lòng tạo ví tài chính trước khi lưu hóa đơn quét.");
      return;
    }

    const category = categories.find(
      (item) => item.name.toLowerCase() === (ocrResult.suggested_category || "").toLowerCase()
    );

    setIsSaving(true);
    setError(null);
    try {
      const payload: TransactionPayload = {
        wallet_id: wallet.id,
        category_id: category?.id ?? null,
        amount: toNumber(ocrResult.total_amount),
        transaction_type: "EXPENSE",
        description: ocrResult.merchant || "Hóa đơn quét AI",
        transaction_date: ocrResult.date ? `${ocrResult.date}T00:00:00` : new Date().toISOString(),
        input_method: "OCR",
        ai_confidence_score: ocrResult.confidence_score,
      };
      await api.createTransaction(payload);
      setSelectedImage(null);
      setSelectedFile(null);
      setOcrResult(null);
      onCreated?.();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, "Không thể lưu hóa đơn quét"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 dark:bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 relative transition-colors duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <ScanLine className="w-4 h-4" strokeWidth={2} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Quét Hóa Đơn Tự Động (AI OCR)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tải lên ảnh biên lai hoặc hóa đơn để AI tự động trích xuất
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 rounded-2xl p-6 text-center bg-slate-50 dark:bg-slate-950/40 transition-all">
            {selectedImage ? (
              <div className="space-y-3">
                <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center relative">
                  <img
                    src={selectedImage}
                    alt="Receipt Preview"
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <label className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer">
                    Chọn ảnh khác
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-500 dark:text-slate-400 shadow-xs">
                  <UploadCloud className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={1.8} />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Nhấp để tải lên ảnh hóa đơn
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Hỗ trợ định dạng PNG, JPG, JPEG (tối đa 10MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Trigger Scan Button */}
          {selectedFile && !ocrResult && (
            <button
              onClick={handleScanReceipt}
              disabled={isScanning}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý OCR & Vision AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Trích Xuất Thông Tin Hóa Đơn</span>
                </>
              )}
            </button>
          )}

          {error && (
            <div className="px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-xs text-rose-600 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.8} />
              <span>{error}</span>
            </div>
          )}

          {/* Extracted Details Box */}
          {ocrResult && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  Kết Quả Nhận Diện ({Math.round(ocrResult.confidence_score * 100)}% độ tin cậy)
                </span>
                <span className="text-[10px] text-slate-400">Vision API Engine</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tên đơn vị / Cửa hàng:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{ocrResult.merchant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Tổng tiền thanh toán:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
                    {toNumber(ocrResult.total_amount).toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Danh mục gợi ý:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{ocrResult.suggested_category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Ngày hóa đơn:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-200">{ocrResult.date}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setOcrResult(null);
                    setError(null);
                  }}
                  className="w-1/2 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Quét Lại
                </button>
                <button
                  onClick={handleSaveOCRResult}
                  disabled={isSaving}
                  className="w-1/2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 font-bold text-xs text-white transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang lưu...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Xác Nhận & Lưu</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
