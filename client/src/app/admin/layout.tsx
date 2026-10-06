import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard | Budgetly Management",
  description: "Hệ thống quản trị và giám sát ứng dụng quản lý tài chính Budgetly",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-100">
      {/* Admin Navigation Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
