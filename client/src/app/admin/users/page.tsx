"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  Users as UsersIcon,
  Search,
  UserCheck,
  UserX,
  Shield,
  Plus,
  Lock,
  Unlock,
  MoreVertical,
  CheckCircle2,
  Mail,
  Calendar,
  X,
  Edit,
  Trash2,
  Eye,
  Crown,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin" | "Premium User" | "Free User";
  status: "Active" | "Suspended" | "Pending";
  balance: number;
  joinedDate: string;
  avatarColor: string;
}

const initialUsers: User[] = [
  {
    id: "USR-1001",
    name: "Nguyễn Tùng Lâm",
    email: "lam23it138@budgetly.io",
    role: "Super Admin",
    status: "Active",
    balance: 45200000,
    joinedDate: "2026-01-15",
    avatarColor: "bg-indigo-600",
  },
  {
    id: "USR-1002",
    name: "Trần Minh Hòa",
    email: "hoa.tran@gmail.com",
    role: "Premium User",
    status: "Active",
    balance: 18500000,
    joinedDate: "2026-02-10",
    avatarColor: "bg-emerald-600",
  },
  {
    id: "USR-1003",
    name: "Lê Hoàng Nam",
    email: "nam.le99@yahoo.com",
    role: "Free User",
    status: "Active",
    balance: 3400000,
    joinedDate: "2026-03-01",
    avatarColor: "bg-purple-600",
  },
  {
    id: "USR-1004",
    name: "Phạm Khánh Linh",
    email: "linh.pham@outlook.com",
    role: "Premium User",
    status: "Active",
    balance: 89000000,
    joinedDate: "2026-03-22",
    avatarColor: "bg-pink-600",
  },
  {
    id: "USR-1005",
    name: "Vũ Quốc Anh",
    email: "spammer_spam99@temp-mail.com",
    role: "Free User",
    status: "Suspended",
    balance: 0,
    joinedDate: "2026-08-14",
    avatarColor: "bg-slate-600",
  },
  {
    id: "USR-1006",
    name: "Đặng Thị Phương",
    email: "phuong.dt@techcorp.vn",
    role: "Admin",
    status: "Active",
    balance: 27100000,
    joinedDate: "2026-04-05",
    avatarColor: "bg-amber-600",
  },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New user form state
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<User["role"]>("Free User");

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleLock = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === "Active" ? "Suspended" : "Active";
          showNotification(
            `Tài khoản ${u.email} đã được ${newStatus === "Active" ? "mở khóa" : "khóa tạm thời"}`
          );
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showNotification("Đã xóa tài khoản khỏi hệ thống");
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const newUser: User = {
      id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newName,
      email: newEmail,
      role: newRole,
      status: "Active",
      balance: 0,
      joinedDate: new Date().toISOString().split("T")[0],
      avatarColor: "bg-indigo-600",
    };

    setUsers([newUser, ...users]);
    setIsAddModalOpen(false);
    setNewName("");
    setNewEmail("");
    showNotification(`Đã tạo thành công tài khoản ${newEmail}`);
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
    <div className="flex-1 pb-12">
      <AdminHeader
        title="👤 Quản Lý Người Dùng Hệ Thống"
        subtitle="Danh sách tài khoản, phân quyền, trạng thái khóa và số dư người dùng"
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-2xl animate-fade-in text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Stats Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Tổng Người Dùng</p>
              <h3 className="text-2xl font-bold text-slate-100 mt-1">{users.length}</h3>
            </div>
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <UsersIcon className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Đang Hoạt Động</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-1">
                {users.filter((u) => u.status === "Active").length}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Tài Khoản Premium</p>
              <h3 className="text-2xl font-bold text-purple-400 mt-1">
                {users.filter((u) => u.role === "Premium User").length}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
              <Crown className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Tài Khoản Bị Khóa</p>
              <h3 className="text-2xl font-bold text-rose-400 mt-1">
                {users.filter((u) => u.status === "Suspended").length}
              </h3>
            </div>
            <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
              <UserX className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter and Action Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900 p-4 border border-slate-800 rounded-2xl">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên, email, user ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">Tất cả vai trò</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="Premium User">Premium User</option>
              <option value="Free User">Free User</option>
            </select>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Active">Hoạt động (Active)</option>
              <option value="Suspended">Bị khóa (Suspended)</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Người Dùng Mới</span>
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold text-slate-400">
                <tr>
                  <th className="px-6 py-4">ID & Người dùng</th>
                  <th className="px-6 py-4">Vai trò (Role)</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Số dư ước tính</th>
                  <th className="px-6 py-4">Ngày tham gia</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500 text-sm">
                      Không tìm thấy người dùng phù hợp với bộ lọc.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-850/60 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full ${user.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-sm`}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-100">{user.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({user.id})
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                              <Mail className="w-3 h-3 text-slate-500" />
                              <span>{user.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                            user.role === "Super Admin"
                              ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
                              : user.role === "Admin"
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : user.role === "Premium User"
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                              : "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                            user.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              user.status === "Active" ? "bg-emerald-400" : "bg-rose-400"
                            }`}
                          ></span>
                          {user.status === "Active" ? "Active" : "Suspended"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono font-semibold text-slate-200">
                        {user.balance.toLocaleString("vi-VN")} ₫
                      </td>

                      <td className="px-6 py-4 text-slate-400 font-mono text-[11px]">
                        {user.joinedDate}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleLock(user.id)}
                            className={`p-1.5 hover:bg-slate-800 rounded-lg transition-colors ${
                              user.status === "Active"
                                ? "text-slate-400 hover:text-rose-400"
                                : "text-rose-400 hover:text-emerald-400"
                            }`}
                            title={user.status === "Active" ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          >
                            {user.status === "Active" ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                            title="Xóa người dùng"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-scale-up">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Thêm Người Dùng Mới</h3>
            <p className="text-xs text-slate-400 mb-5">
              Tạo tài khoản người dùng hoặc gán quyền admin trực tiếp
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Họ & Tên</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Địa chỉ Email</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Vai trò (Role)</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as User["role"])}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Free User">Free User</option>
                  <option value="Premium User">Premium User</option>
                  <option value="Admin">Admin</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30"
                >
                  Xác Nhận Tạo Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-14 h-14 rounded-2xl ${selectedUser.avatarColor} text-white flex items-center justify-center font-bold text-xl shadow-lg`}
              >
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedUser.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {selectedUser.role}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {selectedUser.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">User ID</span>
                <span className="font-mono text-slate-200">{selectedUser.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Số Dư Tổng</span>
                <span className="font-mono font-bold text-emerald-400">
                  {selectedUser.balance.toLocaleString("vi-VN")} ₫
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Ngày Đăng Ký</span>
                <span className="font-mono text-slate-200">{selectedUser.joinedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Thiết Bị Đăng Nhập Gần Nhất</span>
                <span className="text-slate-300">Chrome / macOS Sonoma (IP: 14.226.12.8)</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200"
              >
                Đóng Chi Tiết
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
