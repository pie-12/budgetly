"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useLanguage } from "@/context/LanguageContext";
import {
  Bell,
  Send,
  CheckCircle2,
  X,
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
    title: "Cập nhật tính năng trợ lý thông minh AI v2.4",
    message: "Hệ thống AI nhận diện hóa đơn đã được nâng cấp với độ chính xác đạt 98.6%. Hãy trải nghiệm ngay!",
    targetAudience: "Tất cả người dùng (1,248 tài khoản)",
    sentDate: "2026-10-06 10:00",
    deliveredCount: 1248,
    readRate: "89.4%",
    status: "Sent",
  },
  {
    id: "NOTIF-02",
    title: "Thông báo bảo trì máy chủ định kỳ",
    message: "Hệ thống sẽ tạm thời bảo trì hạ tầng vào lúc 02:00 sáng ngày 08/10/2026 trong khoảng 15 phút.",
    targetAudience: "Tất cả người dùng",
    sentDate: "2026-10-08 02:00",
    deliveredCount: 0,
    readRate: "0%",
    status: "Scheduled",
  },
  {
    id: "NOTIF-03",
    title: "Ưu đãi giảm 30% khi nâng cấp gói Premium",
    message: "Dành riêng cho các thành viên gói Free đăng ký gia hạn trong tuần lễ này.",
    targetAudience: "Người dùng gói Miễn phí (Free)",
    sentDate: "2026-10-01 14:30",
    deliveredCount: 920,
    readRate: "72.1%",
    status: "Sent",
  },
];

export default function AdminNotificationsPage() {
  const { t, language } = useLanguage();
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Users");

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
      sentDate: new Date().toLocaleString(language === "vi" ? "vi-VN" : "en-US"),
      deliveredCount: 1248,
      readRate: "100%",
      status: "Sent",
    };

    setNotifications([newNotif, ...notifications]);
    setIsBroadcastModalOpen(false);
    setTitle("");
    setMessage("");
    showNotification(language === "vi" ? "Đã gửi thông báo broadcast toàn hệ thống thành công!" : "Broadcast notification sent successfully!");
  };

  return (
    <div className="flex-1 pb-12 font-sans transition-colors duration-200">
      <AdminHeader
        title={language === "vi" ? "Quản lý thông báo & phát tin hệ thống" : "System Notifications & Broadcasts"}
        subtitle={
          language === "vi"
            ? "Gửi thông báo hàng loạt cho người dùng, lên lịch tin nhắn và giám sát tỷ lệ mở thông báo"
            : "Send broadcast alerts to users, schedule announcements, and track delivery"
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300 rounded-xl shadow-lg text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{language === "vi" ? "Trung tâm phát tin & thông báo hàng loạt" : "Broadcast & Push Notification Center"}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {language === "vi" ? "Gửi tin tức cập nhật, thông báo khẩn cấp hoặc ưu đãi tới hàng nghìn tài khoản" : "Send updates, critical notices, or announcements to user accounts"}
            </p>
          </div>

          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>{language === "vi" ? "Tạo bản tin mới" : "New Broadcast"}</span>
          </button>
        </div>

        {/* History Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {language === "vi" ? "Lịch sử phát tin" : "Broadcast History"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === "vi" ? "Danh sách các chiến dịch thông báo đã thực hiện" : "List of executed system notification campaigns"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">{language === "vi" ? "Mã & tiêu đề" : "ID & Title"}</th>
                  <th className="px-6 py-4">{language === "vi" ? "Nội dung" : "Content"}</th>
                  <th className="px-6 py-4">{language === "vi" ? "Đối tượng nhận" : "Audience"}</th>
                  <th className="px-6 py-4">{language === "vi" ? "Đã gửi đến" : "Delivered"}</th>
                  <th className="px-6 py-4">{language === "vi" ? "Tỷ lệ mở" : "Open Rate"}</th>
                  <th className="px-6 py-4">{language === "vi" ? "Thời gian" : "Time"}</th>
                  <th className="px-6 py-4 text-right">{language === "vi" ? "Trạng thái" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{n.id}</span>
                      <p className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">{n.title}</p>
                    </td>

                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">{n.message}</td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-medium">
                        {n.targetAudience}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {n.deliveredCount.toLocaleString()} thiết bị
                    </td>

                    <td className="px-6 py-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">{n.readRate}</td>

                    <td className="px-6 py-4 text-slate-400 dark:text-slate-500 font-mono text-[11px]">{n.sentDate}</td>

                    <td className="px-6 py-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          n.status === "Sent"
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                            : "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30"
                        }`}
                      >
                        {n.status === "Sent" ? "Đã gửi" : "Đã lên lịch"}
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsBroadcastModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-1">
              <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {language === "vi" ? "Phát thông báo toàn hệ thống" : "System Broadcast Message"}
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
              {language === "vi" ? "Nội dung sẽ hiển thị trực tiếp trên thanh thông báo của người dùng" : "Message will be delivered directly to users' notification bar"}
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi" ? "Tiêu đề thông báo" : "Notification Title"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === "vi" ? "Ví dụ: Nâng cấp trợ lý AI hoàn tất" : "e.g. System upgrade completed"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi" ? "Đối tượng nhận tin" : "Target Audience"}
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                >
                  <option value="All Users">{language === "vi" ? "Tất cả người dùng (1,248 tài khoản)" : "All users (1,248 accounts)"}</option>
                  <option value="Premium Users">{language === "vi" ? "Chỉ người dùng Premium" : "Premium users only"}</option>
                  <option value="Free Tier Users">{language === "vi" ? "Chỉ người dùng gói miễn phí" : "Free tier users only"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi" ? "Nội dung bản tin" : "Broadcast Message"}
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder={language === "vi" ? "Nhập nội dung cần gửi đến người dùng..." : "Enter message to send..."}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {language === "vi" ? "Hủy" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === "vi" ? "Gửi thông báo ngay" : "Send Broadcast Now"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
