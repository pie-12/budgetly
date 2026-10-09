"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Bell,
  Send,
  Plus,
  CheckCircle2,
  Users,
  Clock,
  AlertCircle,
  X,
  History,
  Sparkles,
} from "lucide-react";

interface SystemNotification {
  id: string;
  title: string;
  message: string;
  targetAudience: string;
  sentDate: string;
  deliveredCount: number;
  readRate: string;
  status: "Sent" | "Scheduled";
}

const initialNotifications: SystemNotification[] = [
  {
    id: "NOTIF-01",
    title: "Cập nhật hệ thống AI Smart Assistant v2.4",
    message: "Hệ thống AI nhận diện hóa đơn đã được nâng cấp độ chính xác lên 98.6%. Thử ngay!",
    targetAudience: "Tất cả người dùng (1,248 users)",
    sentDate: "2026-10-06 10:00",
    deliveredCount: 1248,
    readRate: "89.4%",
    status: "Sent",
  },
  {
    id: "NOTIF-02",
    title: "Cảnh báo bảo trì server định kỳ",
    message: "Hệ thống sẽ tạm thời bảo trì vào lúc 02:00 AM ngày 08/10/2026 trong khoảng 15 phút.",
    targetAudience: "Tất cả người dùng",
    sentDate: "2026-10-08 02:00",
    deliveredCount: 0,
    readRate: "0%",
    status: "Scheduled",
  },
  {
    id: "NOTIF-03",
    title: "Ưu đãi nâng cấp Premium giảm 30%",
    message: "Dành riêng cho thành viên gói Free đăng ký trong tuần này.",
    targetAudience: "Người dùng Free Tier",
    sentDate: "2026-10-01 14:30",
    deliveredCount: 920,
    readRate: "72.1%",
    status: "Sent",
  },
];

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("Tất cả người dùng");

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    const newNotif: SystemNotification = {
      id: `NOTIF-0${notifications.length + 1}`,
      title,
      message,
      targetAudience: audience,
      sentDate: new Date().toLocaleString("vi-VN"),
      deliveredCount: 1248,
      readRate: "100%",
      status: "Sent",
    };

    setNotifications([newNotif, ...notifications]);
    setIsBroadcastModalOpen(false);
    setTitle("");
    setMessage("");
    showNotification("Đã gửi thành công thông báo Broadcast toàn hệ thống!");
  };

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="🔔 Quản Lý Thông Báo & Broadcast Hệ Thống"
        subtitle="Gửi thông báo hàng loạt tới người dùng, đặt lịch nhắc nhở và quản lý mẫu tin nhắn"
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-2xl text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Action Header */}
        <div className="flex items-center justify-between bg-slate-900 p-6 border border-slate-800 rounded-2xl">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Gửi Thông Báo Mới (Broadcast Center)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Phát thông tin cập nhật, cảnh báo hoặc khuyến mãi đến hàng ngàn người dùng cùng lúc
            </p>
          </div>

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/25 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Tạo Broadcast Mới</span>
          </button>
        </div>

        {/* History Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-100 text-base">Lịch Sử Gửi Thông Báo</h3>
              <p className="text-xs text-slate-400">Danh sách các chiến dịch thông báo đã phát hành</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold text-slate-400">
                <tr>
                  <th className="px-6 py-4">Mã & Tiêu đề</th>
                  <th className="px-6 py-4">Nội dung tóm tắt</th>
                  <th className="px-6 py-4">Đối tượng nhận</th>
                  <th className="px-6 py-4">Số lượng gửi</th>
                  <th className="px-6 py-4">Tỷ lệ mở</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4 text-right">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-indigo-400 font-bold">{n.id}</span>
                      <p className="font-bold text-slate-100 mt-0.5">{n.title}</p>
                    </td>

                    <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{n.message}</td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px] font-medium">
                        {n.targetAudience}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                      {n.deliveredCount.toLocaleString()} devices
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">{n.readRate}</td>

                    <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">{n.sentDate}</td>

                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          n.status === "Sent"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {n.status === "Sent" ? "Đã gửi" : "Lên lịch"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Broadcast Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setIsBroadcastModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Gửi Thông Báo Broadcast</h3>
            <p className="text-xs text-slate-400 mb-5">
              Nội dung sẽ xuất hiện trực tiếp trong ứng dụng di động & web của người dùng
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tiêu Đề Thông Báo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nâng cấp hệ thống AI thành công"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Đối Tượng Nhận
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Tất cả người dùng">Tất cả người dùng (All - 1,248 users)</option>
                  <option value="Người dùng Premium">Người dùng Premium Only</option>
                  <option value="Người dùng Free Tier">Người dùng Free Tier Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nội Dung Chi Tiết
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập thông điệp truyền tải tới người dùng..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Phát Thông Báo Ngay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
