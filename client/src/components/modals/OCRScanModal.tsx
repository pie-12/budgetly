"use client";

import { useState } from "react";

interface OCRScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (newTx: any) => void;
}

export default function OCRScanModal({
  isOpen,
  onClose,
  onAddTransaction,
}: OCRScanModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setOcrResult(null);
    }
  };

  const handleSimulateOCR = () => {
    if (!selectedImage) return;
    setIsScanning(true);

    setTimeout(() => {
      setOcrResult({
        merchant: "WinMart Supermarket (Grocery Receipt)",
        amount: 185000,
        category: "Food & Dining",
        date: new Date().toISOString().split("T")[0],
        confidence: 0.95,
      });
      setIsScanning(false);
    }, 1000);
  };

  const handleSaveOCRResult = () => {
    if (!ocrResult) return;
    onAddTransaction({
      id: Date.now(),
      description: ocrResult.merchant,
      amount: ocrResult.amount,
      type: "expense",
      category: ocrResult.category,
      wallet: "E-Wallet",
      date: ocrResult.date,
    });

    setSelectedImage(null);
    setOcrResult(null);
    onClose();
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
          {selectedImage && !ocrResult && (
            <button
              onClick={handleSimulateOCR}
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

          {/* Extracted Details Box */}
          {ocrResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  OCR Result (95% Accuracy)
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
                  <span className="font-bold text-emerald-400 text-sm">{ocrResult.amount.toLocaleString("en-US")} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Suggested Category:</span>
                  <span className="font-semibold text-slate-200">{ocrResult.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction Date:</span>
                  <span className="font-semibold text-slate-200">{ocrResult.date}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setOcrResult(null)}
                  className="w-1/2 py-2 rounded-lg border border-slate-800 text-xs font-medium text-slate-400 hover:text-slate-200"
                >
                  Rescan
                </button>
                <button
                  onClick={handleSaveOCRResult}
                  className="w-1/2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 font-bold text-xs text-slate-950 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
                >
                  Confirm & Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
