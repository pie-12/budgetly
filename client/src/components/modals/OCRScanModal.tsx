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
      setError(getErrorMessage(err, "Could not scan the receipt"));
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveOCRResult = async () => {
    if (!ocrResult) return;

    const wallet = wallets[0];
    if (!wallet) {
      setError("Create a wallet first before saving scanned receipts.");
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
        description: ocrResult.merchant || "Scanned receipt",
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
      setError(getErrorMessage(err, "Could not save the scanned receipt"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-sm">
              📷
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                AI Receipt Scanner (OCR)
              </h3>
              <p className="text-xs text-slate-400">
                Upload grocery or restaurant receipts for automatic data extraction
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-6 text-center bg-slate-950/40 transition-all">
            {selectedImage ? (
              <div className="space-y-3">
                <div className="h-44 w-full rounded-xl overflow-hidden bg-black flex items-center justify-center relative">
                  <img
                    src={selectedImage}
                    alt="Receipt Preview"
                    className="max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center gap-3">
                  <label className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer underline">
                    Change image
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
                <div className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-xl">
                  📄
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Click to upload receipt image
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports PNG, JPG, JPEG up to 10MB
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
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
            >
              {isScanning ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing OCR & Vision AI...
                </>
              ) : (
                <>
                  <span>Extract Receipt Information</span>
                  <span>✨</span>
                </>
              )}
            </button>
          )}

          {error && (
            <div className="px-3 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              ⚠ {error}
            </div>
          )}

          {/* Extracted Details Box */}
          {ocrResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  OCR Result ({Math.round(ocrResult.confidence_score * 100)}% confidence)
                </span>
                <span className="text-[10px] text-slate-400">Vision API Engine</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Merchant:</span>
                  <span className="font-semibold text-slate-200">{ocrResult.merchant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Amount:</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {toNumber(ocrResult.total_amount).toLocaleString("en-US")} ₫
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Suggested Category:</span>
                  <span className="font-semibold text-slate-200">{ocrResult.suggested_category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction Date:</span>
                  <span className="font-semibold text-slate-200">{ocrResult.date}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => {
                    setOcrResult(null);
                    setError(null);
                  }}
                  className="w-1/2 py-2 rounded-lg border border-slate-800 text-xs font-medium text-slate-400 hover:text-slate-200"
                >
                  Rescan
                </button>
                <button
                  onClick={handleSaveOCRResult}
                  disabled={isSaving}
                  className="w-1/2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-xs text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                >
                  {isSaving ? "Saving..." : "Confirm & Save"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
