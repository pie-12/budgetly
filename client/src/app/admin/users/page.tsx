"use client";

import { useState, useEffect, useCallback } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import { useLanguage } from "@/context/LanguageContext";
import { api, getErrorMessage, AdminUser } from "@/services/api";
import {
  Users as UsersIcon,
  Search,
  UserCheck,
  UserX,
  Plus,
  Lock,
  Unlock,
  CheckCircle2,
  Mail,
  X,
  Trash2,
  Eye,
  Crown,
  RefreshCw,
  AlertCircle,
  Loader2,
  Wallet,
  Receipt,
  Calendar,
} from "lucide-react";

interface UserViewModel {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Premium User" | "Free User";
  status: "Active" | "Suspended" | "Pending";
  balance: number;
  wallets_count: number;
  transactions_count: number;
  joinedDate: string;
  avatarColor: string;
}

const AVATAR_COLORS = [
  "bg-indigo-600",
  "bg-emerald-600",
  "bg-purple-600",
  "bg-blue-600",
  "bg-pink-600",
  "bg-amber-600",
  "bg-teal-600",
];

export default function AdminUsersPage() {
  const { t, language } = useLanguage();
  const [users, setUsers] = useState<UserViewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<UserViewModel | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  // New user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("123456");
  const [newRole, setNewRole] = useState<UserViewModel["role"]>("Free User");
  const [isCreating, setIsCreating] = useState(false);

  const showNotification = (msg: string, isError = false) => {
    setToastMessage({ text: msg, isError });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadUsersFromDatabase = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getAdminUsers();
      const mapped: UserViewModel[] = (res.data || []).map((u: AdminUser, idx: number) => ({
        id: u.id,
        name: u.full_name || u.email.split("@")[0],
        email: u.email,
        role: (u.role as UserViewModel["role"]) || "Free User",
        status: (u.status as UserViewModel["status"]) || "Active",
        balance: u.balance || 0,
        wallets_count: u.wallets_count || 0,
        transactions_count: u.transactions_count || 0,
        joinedDate: u.joined_date || u.created_at?.slice(0, 10) || "2026-01-01",
        avatarColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
      }));
      setUsers(mapped);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          language === "vi"
            ? "Không thể tải danh sách người dùng từ PostgreSQL. Vui lòng thử lại."
            : "Could not load user accounts from PostgreSQL database."
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  useEffect(() => {
    loadUsersFromDatabase();
  }, [loadUsersFromDatabase]);

  const handleToggleLock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "Active" ? "Suspended" : "Active";
          showNotification(
            language === "vi"
              ? `Tài khoản ${u.email} đã được ${newStatus === "Active" ? "mở khóa" : "tạm khóa"}`
              : `Account ${u.email} has been ${newStatus === "Active" ? "unlocked" : "suspended"}`
          );
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    const confirmText =
      language === "vi"
        ? `Bạn có chắc chắn muốn xóa tài khoản ${email} khỏi cơ sở dữ liệu PostgreSQL không?`
        : `Are you sure you want to delete user ${email} from the PostgreSQL database?`;

    if (!window.confirm(confirmText)) return;

    try {
      await api.deleteAdminUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showNotification(
        language === "vi"
          ? `Đã xóa người dùng ${email} khỏi cơ sở dữ liệu PostgreSQL thành công.`
          : `User ${email} deleted successfully from PostgreSQL.`
      );
    } catch (err) {
      showNotification(
        getErrorMessage(
          err,
          language === "vi" ? "Không thể xóa người dùng này." : "Failed to delete user."
        ),
        true
      );
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setIsCreating(true);
    try {
      const res = await api.createAdminUser({
        email: newEmail.trim(),
        full_name: newName.trim() || undefined,
        password: newPassword || "123456",
        role: newRole,
      });

      const newUser: UserViewModel = {
        id: res.data.id,
        name: res.data.full_name || res.data.email.split("@")[0],
        email: res.data.email,
        role: (res.data.role as UserViewModel["role"]) || newRole,
        status: (res.data.status as UserViewModel["status"]) || "Active",
        balance: res.data.balance || 0,
        wallets_count: res.data.wallets_count || 1,
        transactions_count: 0,
        joinedDate: res.data.joined_date || new Date().toISOString().slice(0, 10),
        avatarColor: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
      };

      setUsers([newUser, ...users]);
      setIsAddModalOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("123456");
      showNotification(
        language === "vi"
          ? `Tài khoản ${res.data.email} đã được lưu vào cơ sở dữ liệu PostgreSQL.`
          : `Account ${res.data.email} has been saved to PostgreSQL database.`
      );
    } catch (err) {
      showNotification(
        getErrorMessage(
          err,
          language === "vi" ? "Lỗi khi tạo người dùng mới." : "Error creating user."
        ),
        true
      );
    } finally {
      setIsCreating(false);
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex-1 pb-12 font-sans transition-colors duration-200">
      <AdminHeader
        title={language === "vi" ? "Quản lý người dùng hệ thống" : "System User Management"}
        subtitle={
          language === "vi"
            ? "Đồng bộ trực tiếp với cơ sở dữ liệu PostgreSQL: tài khoản, số dư thực tế, phân quyền vai trò"
            : "Directly synchronized with PostgreSQL database: accounts, live balances, role administration"
        }
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-xs font-medium border ${
              toastMessage.isError
                ? "bg-rose-50 dark:bg-rose-950 border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-300"
                : "bg-emerald-50 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
            }`}
          >
            {toastMessage.isError ? (
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl flex items-center justify-between text-xs text-rose-700 dark:text-rose-400">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadUsersFromDatabase}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold shrink-0 cursor-pointer"
            >
              {language === "vi" ? "Thử lại" : "Retry"}
            </button>
          </div>
        )}

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {language === "vi" ? "Tổng người dùng (PostgreSQL)" : "Total Users (PostgreSQL)"}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {isLoading ? "..." : users.length}
              </h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-200 dark:border-blue-500/20">
              <UsersIcon className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {language === "vi" ? "Đang hoạt động" : "Active Users"}
              </p>
              <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {isLoading ? "..." : users.filter((u) => u.status === "Active").length}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {language === "vi" ? "Quản trị viên hệ thống" : "System Administrators"}
              </p>
              <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                {isLoading ? "..." : users.filter((u) => u.role === "Super Admin" || u.role === "Admin").length}
              </h3>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-200 dark:border-indigo-500/20">
              <Crown className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {language === "vi" ? "Tài khoản đang khóa" : "Suspended Accounts"}
              </p>
              <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
                {isLoading ? "..." : users.filter((u) => u.status === "Suspended").length}
              </h3>
            </div>
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl border border-rose-200 dark:border-rose-500/20">
              <UserX className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={language === "vi" ? "Tìm theo tên, email, UUID..." : "Search name, email, UUID..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="All">{language === "vi" ? "Tất cả vai trò" : "All roles"}</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Premium User">Premium User</option>
              <option value="Free User">Free User</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="All">{language === "vi" ? "Tất cả trạng thái" : "All statuses"}</option>
              <option value="Active">{language === "vi" ? "Hoạt động" : "Active"}</option>
              <option value="Suspended">{language === "vi" ? "Bị khóa" : "Suspended"}</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadUsersFromDatabase}
              disabled={isLoading}
              className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs transition-colors cursor-pointer shrink-0"
              title={t("refresh")}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-all shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{language === "vi" ? "Thêm người dùng" : "Add New User"}</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-6 py-4">{language === "vi" ? "Người dùng & email" : "User & Email"}</th>
                  <th className="px-6 py-4">{language === "vi" ? "Vai trò" : "Role"}</th>
                  <th className="px-6 py-4">{language === "vi" ? "Trạng thái" : "Status"}</th>
                  <th className="px-6 py-4">{language === "vi" ? "Tổng số dư" : "Total Balance"}</th>
                  <th className="px-6 py-4">{language === "vi" ? "Số ví / giao dịch" : "Wallets / Txs"}</th>
                  <th className="px-6 py-4">{language === "vi" ? "Ngày đăng ký" : "Joined Date"}</th>
                  <th className="px-6 py-4 text-right">{language === "vi" ? "Thao tác" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400 dark:text-slate-500 text-xs">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                        <span>{language === "vi" ? "Đang tải dữ liệu từ PostgreSQL..." : "Loading accounts from PostgreSQL..."}</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
                      {language === "vi" ? "Không tìm thấy người dùng phù hợp." : "No users match the current filters."}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${u.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0`}
                          >
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 dark:text-slate-100 truncate">{u.name}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                            u.role === "Super Admin"
                              ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/40"
                              : u.role === "Admin"
                              ? "bg-amber-50 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/40"
                              : u.role === "Premium User"
                              ? "bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/40"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                            u.status === "Active"
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                              : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                            }`}
                          ></span>
                          {u.status === "Active"
                            ? (language === "vi" ? "Hoạt động" : "Active")
                            : (language === "vi" ? "Bị khóa" : "Suspended")}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {u.balance.toLocaleString("vi-VN")} ₫
                      </td>

                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                        <span className="font-semibold text-slate-900 dark:text-slate-200">{u.wallets_count} ví</span>
                        <span className="text-slate-400"> / </span>
                        <span>{u.transactions_count} GD</span>
                      </td>

                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {u.joinedDate}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors cursor-pointer"
                            title={language === "vi" ? "Xem chi tiết" : "View details"}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleLock(u.id)}
                            className={`p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer ${
                              u.status === "Active"
                                ? "text-slate-400 hover:text-rose-600"
                                : "text-rose-600 hover:text-emerald-600"
                            }`}
                            title={
                              u.status === "Active"
                                ? (language === "vi" ? "Khóa tài khoản" : "Lock account")
                                : (language === "vi" ? "Mở khóa tài khoản" : "Unlock account")
                            }
                          >
                            {u.status === "Active" ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u.id, u.email)}
                            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                            title={language === "vi" ? "Xóa khỏi PostgreSQL" : "Delete from PostgreSQL"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              {language === "vi" ? "Thêm tài khoản vào PostgreSQL" : "Add New User to PostgreSQL"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {language === "vi"
                ? "Tài khoản sẽ được tạo trực tiếp vào DB kèm bộ danh mục và ví tiền mặt mặc định."
                : "User record will be persisted directly to PostgreSQL with default wallet and categories."}
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t("full_name")}
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t("email")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t("password")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="Mật khẩu khởi tạo (tối thiểu 6 ký tự)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === "vi" ? "Vai trò" : "Role"}
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as UserViewModel["role"])}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="Free User">Free User</option>
                  <option value="Premium User">Premium User</option>
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-xs font-semibold text-white shadow-xs cursor-pointer active:scale-95"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{language === "vi" ? "Đang lưu DB..." : "Saving..."}</span>
                    </>
                  ) : (
                    <span>{language === "vi" ? "Lưu vào PostgreSQL" : "Save to Database"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-14 h-14 rounded-2xl ${selectedUser.avatarColor} text-white flex items-center justify-center font-bold text-xl shadow-xs`}
              >
                {selectedUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate">{selectedUser.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                    {selectedUser.role}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">PostgreSQL UUID</span>
                <span className="font-mono text-[11px] text-slate-900 dark:text-slate-200 select-all">{selectedUser.id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {language === "vi" ? "Tổng số dư thực tế" : "Actual PostgreSQL Balance"}
                </span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedUser.balance.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {language === "vi" ? "Số lượng ví & giao dịch" : "Wallets & Transactions"}
                </span>
                <span className="font-mono text-slate-900 dark:text-slate-200">
                  {selectedUser.wallets_count} ví · {selectedUser.transactions_count} giao dịch
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">
                  {language === "vi" ? "Ngày tạo tài khoản" : "Created At"}
                </span>
                <span className="font-mono text-slate-900 dark:text-slate-200">{selectedUser.joinedDate}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
