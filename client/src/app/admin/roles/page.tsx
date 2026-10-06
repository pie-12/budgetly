"use client";

import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  CheckCircle2,
  Plus,
  Lock,
  Check,
  X,
  Edit,
  Trash2,
} from "lucide-react";

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  isSystem: boolean;
  permissions: {
    manageUsers: boolean;
    manageCategories: boolean;
    manageTransactions: boolean;
    exportReports: boolean;
    manageNotifications: boolean;
    viewAuditLogs: boolean;
    manageSettings: boolean;
  };
}

const initialRoles: Role[] = [
  {
    id: "ROLE-01",
    name: "Super Admin",
    description: "Toàn quyền quản trị cao nhất hệ thống, cấu hình server và phân quyền",
    usersCount: 2,
    isSystem: true,
    permissions: {
      manageUsers: true,
      manageCategories: true,
      manageTransactions: true,
      exportReports: true,
      manageNotifications: true,
      viewAuditLogs: true,
      manageSettings: true,
    },
  },
  {
    id: "ROLE-02",
    name: "System Admin",
    description: "Quản lý người dùng, danh mục và cấu hình vận hành hàng ngày",
    usersCount: 5,
    isSystem: true,
    permissions: {
      manageUsers: true,
      manageCategories: true,
      manageTransactions: true,
      exportReports: true,
      manageNotifications: true,
      viewAuditLogs: true,
      manageSettings: false,
    },
  },
  {
    id: "ROLE-03",
    name: "Finance Auditor",
    description: "Chỉ có quyền xem & kiểm toán giao dịch, xuất báo cáo doanh thu",
    usersCount: 3,
    isSystem: false,
    permissions: {
      manageUsers: false,
      manageCategories: false,
      manageTransactions: true,
      exportReports: true,
      manageNotifications: false,
      viewAuditLogs: true,
      manageSettings: false,
    },
  },
  {
    id: "ROLE-04",
    name: "Community Support",
    description: "Hỗ trợ mở/khóa tài khoản người dùng và gửi thông báo hỗ trợ",
    usersCount: 8,
    isSystem: false,
    permissions: {
      manageUsers: true,
      manageCategories: false,
      manageTransactions: false,
      exportReports: false,
      manageNotifications: true,
      viewAuditLogs: false,
      manageSettings: false,
    },
  },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);

  // New role state
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTogglePermission = (roleId: string, permKey: keyof Role["permissions"]) => {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id === roleId) {
          if (r.isSystem && r.name === "Super Admin") {
            showNotification("Không thể thay đổi quyền tối cao của Super Admin!");
            return r;
          }
          const updated = {
            ...r,
            permissions: {
              ...r.permissions,
              [permKey]: !r.permissions[permKey],
            },
          };
          showNotification(`Đã cập nhật ma trận phân quyền cho vai trò "${r.name}"`);
          return updated;
        }
        return r;
      })
    );
  };

  const handleCreateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;

    const newRoleObj: Role = {
      id: `ROLE-0${roles.length + 1}`,
      name: newRoleName,
      description: newRoleDesc,
      usersCount: 0,
      isSystem: false,
      permissions: {
        manageUsers: false,
        manageCategories: true,
        manageTransactions: false,
        exportReports: true,
        manageNotifications: false,
        viewAuditLogs: false,
        manageSettings: false,
      },
    };

    setRoles([...roles, newRoleObj]);
    setIsAddRoleModalOpen(false);
    setNewRoleName("");
    setNewRoleDesc("");
    showNotification(`Đã tạo vai trò quản trị mới "${newRoleName}"`);
  };

  const permissionLabels: { key: keyof Role["permissions"]; label: string }[] = [
    { key: "manageUsers", label: "Quản lý Người Dùng (Lock/Role)" },
    { key: "manageCategories", label: "Quản lý Danh Mục Thu Chi" },
    { key: "manageTransactions", label: "Giám sát & Flag Giao dịch" },
    { key: "exportReports", label: "Xuất Báo cáo & Thống kê" },
    { key: "manageNotifications", label: "Phát Thông báo Broadcast" },
    { key: "viewAuditLogs", label: "Xem Nhật ký Audit Logs" },
    { key: "manageSettings", label: "Thay đổi Cấu hình Server" },
  ];

  return (
    <div className="flex-1 pb-12">
      <AdminHeader
        title="👑 Quản Lý Vai Trò & Phân Quyền (Roles & Permissions)"
        subtitle="Ma trận phân quyền chi tiết cho ban quản trị, auditor và nhân viên hỗ trợ"
      />

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Toast */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl shadow-2xl text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Roles overview cards */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-100">Danh Sách Vai Trò Quản Trị</h3>
            <p className="text-xs text-slate-400">Có {roles.length} vai trò đang hoạt động</p>
          </div>

          <button
            onClick={() => setIsAddRoleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Vai Trò Mới</span>
          </button>
        </div>

        {/* Permission Matrix Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 text-base">Ma Trận Phân Quyền Chi Tiết (Permission Matrix)</h3>
            <p className="text-xs text-slate-400">Click vào checkbox để bật/tắt quyền tương ứng cho từng vai trò</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 border-b border-slate-800 uppercase tracking-wider text-[11px] font-semibold text-slate-400">
                <tr>
                  <th className="px-6 py-4">Tên Quyền Hạn (Permission)</th>
                  {roles.map((r) => (
                    <th key={r.id} className="px-6 py-4 text-center">
                      <div className="font-bold text-slate-200">{r.name}</div>
                      <span className="text-[10px] text-slate-400 font-normal">
                        ({r.usersCount} tài khoản)
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {permissionLabels.map((perm) => (
                  <tr key={perm.key} className="hover:bg-slate-850/60 transition-colors">
                    <td className="px-6 py-4 font-semibold text-slate-200">{perm.label}</td>

                    {roles.map((r) => {
                      const isAllowed = r.permissions[perm.key];
                      return (
                        <td key={r.id} className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleTogglePermission(r.id, perm.key)}
                            className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                              isAllowed
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30"
                                : "bg-slate-800 text-slate-600 border border-slate-700 hover:text-slate-400"
                            }`}
                          >
                            {isAllowed ? <Check className="w-4 h-4 stroke-[3]" /> : <X className="w-4 h-4" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Role Modal */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddRoleModalOpen(false)}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">Tạo Vai Trò Quản Trị Mới</h3>
            <p className="text-xs text-slate-400 mb-5">Định nghĩa vai trò mới cho nhân sự vận hành hệ thống</p>

            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Vai Trò</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Security Auditor"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mô Tả Nhiệm Vụ</label>
                <textarea
                  rows={3}
                  placeholder="Mô tả phạm vi công việc..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddRoleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30"
                >
                  Tạo Vai Trò
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
