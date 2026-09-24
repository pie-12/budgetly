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
        merchant: "Siêu thị WinMart+ (Hóa đơn mua sắm)",
        amount: 185000,
        category: "Mua sắm",
        date: new Date().toISOString().split("T")[0],
        confidence: 0.95,
      });
      setIsScanning(false);
    }, 1200);
  };

  const handleSaveOCRResult = () => {
    if (!ocrResult) return;
    onAddTransaction({
      id: Date.now(),
      description: ocrResult.merchant,
      amount: ocrResult.amount,
      type: "expense",
      category: ocrResult.category,
      wallet: "Ví MoMo",
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
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>📷 Quét Hóa đơn Tự động (AI OCR)</span>
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 mt-4">
          {/* Image Upload Area */}
          <div className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-xl p-4 text-center bg-slate-950/60 transition-all">
            {selectedImage ? (
              <div className="space-y-3">
                <img
                  src={selectedImage}
                  alt="Receipt Preview"
                  className="max-h-48 mx-auto rounded-lg object-contain border border-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-xs text-rose-400 hover:underline"
                >
                  Xóa / Chọn lại ảnh khác
                </button>
              </div>
            ) : (
              <label className="cursor-pointer block py-6 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-2xl border border-emerald-500/20">
                  🧾
                </div>
                <p className="text-sm font-semibold text-slate-200">
                  Nhấp để tải lên ảnh Hóa đơn (JPG, PNG)
                </p>
                <p className="text-xs text-slate-500">Hỗ trợ tự động bóc tách Tên cửa hàng, Tổng tiền, Ngày mua</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Process OCR Button */}
          {selectedImage && !ocrResult && (
            <button
              onClick={handleSimulateOCR}
              disabled={isScanning}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
            >
              {isScanning ? (
                <>
                  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>AI đang quét & bóc tách hóa đơn...</span>
                </>
              ) : (
                <>
                  <span>⚡ Kích hoạt AI Bóc tách Hóa đơn</span>
                </>
              )}
            </button>
          )}

          {/* OCR Extracted Result Form */}
          {ocrResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400">
                  ✓ Kết quả bóc tách thành công (Độ tin cậy: {(ocrResult.confidence * 100).toFixed(0)}%)
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Tên cửa hàng/Merchant:</span>
                  <input
                    type="text"
                    value={ocrResult.merchant}
                    onChange={(e) => setOcrResult({ ...ocrResult, merchant: e.target.value })}
                    className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 font-semibold text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400">Tổng tiền:</span>
                    <input
                      type="number"
                      value={ocrResult.amount}
                      onChange={(e) => setOcrResult({ ...ocrResult, amount: parseFloat(e.target.value) })}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-slate-400">Danh mục:</span>
                    <select
                      value={ocrResult.category}
                      onChange={(e) => setOcrResult({ ...ocrResult, category: e.target.value })}
                      className="w-full mt-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 text-xs"
                    >
                      <option value="Mua sắm">Mua sắm</option>
                      <option value="Ăn uống">Ăn uống</option>
                      <option value="Di chuyển">Di chuyển</option>
                      <option value="Tiện ích">Tiện ích</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700"
            >
              Hủy
            </button>
            {ocrResult && (
              <button
                type="button"
                onClick={handleSaveOCRResult}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30"
              >
                Xác nhận & Lưu Giao dịch
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
