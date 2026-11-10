"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "vi" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "budgetly_language";

export const translations: Record<Language, Record<string, string>> = {
  vi: {
    // Brand & Common
    app_name: "Budgetly",
    app_subtitle: "Quản lý tài chính thông minh",
    admin_portal: "Quản trị hệ thống",
    live: "Trực tiếp",
    active: "Hoạt động",
    search: "Tìm kiếm...",
    save: "Lưu",
    cancel: "Hủy",
    delete: "Xóa",
    edit: "Sửa",
    add: "Thêm",
    retry: "Thử lại",
    loading: "Đang tải dữ liệu...",
    close: "Đóng",
    status: "Trạng thái",
    actions: "Thao tác",
    time: "Thời gian",
    all: "Tất cả",
    normal: "Bình thường",
    warning: "Cảnh báo",
    danger: "Nguy hiểm",
    critical: "Nghiêm trọng",
    income: "Thu nhập",
    expense: "Chi tiêu",
    month: "Tháng",
    year: "Năm",

    // Navigation (User)
    nav_dashboard: "Bảng điều khiển",
    nav_wallets: "Ví tài chính",
    nav_transactions: "Giao dịch",
    nav_budgets: "Ngân sách",
    nav_analytics: "Báo cáo & phân tích",
    nav_settings: "Cài đặt",
    nav_admin: "Quản trị hệ thống",
    main_menu: "Menu chính",
    back_to_user_app: "Về trang người dùng",

    // Navigation (Admin)
    admin_nav_dashboard: "Bảng điều khiển",
    admin_nav_users: "Người dùng",
    admin_nav_categories: "Danh mục",
    admin_nav_transactions: "Giao dịch",
    admin_nav_budgets: "Ngân sách",
    admin_nav_reports: "Báo cáo",
    admin_nav_notifications: "Thông báo",
    admin_nav_audit: "Nhật ký kiểm toán",
    admin_nav_roles: "Phân quyền",
    admin_nav_settings: "Cài đặt hệ thống",

    // Auth
    login: "Đăng nhập",
    register: "Đăng ký",
    logout: "Đăng xuất",
    email: "Email",
    password: "Mật khẩu",
    full_name: "Họ và tên",
    dont_have_account: "Chưa có tài khoản?",
    already_have_account: "Đã có tài khoản?",
    auth_required: "Vui lòng đăng nhập để tiếp tục",
    access_denied: "Từ chối truy cập! Trang quản trị chỉ dành cho tài khoản quản trị viên.",

    // Header
    ocr_scan_btn: "Quét hóa đơn (OCR)",
    add_tx_btn: "Thêm giao dịch",
    refresh: "Làm mới",
    switch_theme_light: "Chuyển sang giao diện sáng",
    switch_theme_dark: "Chuyển sang giao diện tối",
    switch_lang_en: "Chuyển sang tiếng Anh",
    switch_lang_vi: "Chuyển sang tiếng Việt",

    // User Dashboard
    total_balance: "Tổng số dư khả dụng",
    monthly_income: "Tổng thu nhập tháng",
    monthly_expense: "Tổng chi tiêu tháng",
    budget_usage: "Mức sử dụng ngân sách",
    ai_input_placeholder: "Nhập hoặc nói: 'Ăn trưa bún bò 45k bằng ví tiền mặt'...",
    ai_input_btn: "Thêm bằng AI",
    recent_transactions: "Giao dịch gần đây",
    category_breakdown: "Cơ cấu chi tiêu theo danh mục",
    ai_forecast_title: "Dự báo & cảnh báo tài chính AI",
    no_transactions_yet: "Chưa có giao dịch nào được ghi nhận.",
    view_all: "Xem tất cả",

    // Admin Dashboard
    admin_dashboard_title: "Bảng điều khiển quản trị hệ thống",
    admin_dashboard_sub: "Tổng quan hoạt động, hiệu suất máy chủ và các phân hệ quản lý cốt lõi",
    total_users_stat: "Tổng người dùng",
    total_tx_stat: "Giao dịch hệ thống",
    fraud_alerts_stat: "Cảnh báo bất thường",
    ocr_scans_stat: "Lượt quét OCR hóa đơn",
    core_modules: "Các phân hệ quản trị hệ thống",
    server_infrastructure: "Hạ tầng máy chủ & hiệu năng",
    all_nodes_operational: "Tất cả node hoạt động bình thường",
    cpu_load: "Tải CPU",
    ram_allocated: "Bộ nhớ RAM",
    api_latency: "Độ trễ API",
    recent_audit_stream: "Nhật ký thao tác gần đây",
    quick_actions: "Thao tác nhanh",
    broadcast_btn: "Phát thông báo toàn hệ thống",
    add_category_btn: "Thêm danh mục chi tiêu mới",
    create_admin_acc: "Tạo tài khoản quản trị viên",
    backup_db_btn: "Sao lưu cơ sở dữ liệu ngay",
    system_status: "Trạng thái máy chủ",
    new_users_month: "người dùng mới trong tháng",
    total_flow: "Tổng luân chuyển",
    requires_review: "Yêu cầu kiểm duyệt viên rà soát",
    ai_accuracy: "Độ chính xác nhận diện AI",

    // Wallets
    wallets_title: "Ví tài chính",
    wallets_subtitle: "Quản lý nguồn tiền, tài khoản ngân hàng và ví điện tử",
    add_wallet: "Thêm ví mới",

    // Budgets
    budgets_title: "Quản lý ngân sách",
    budgets_subtitle: "Thiết lập hạn mức chi tiêu cho từng danh mục trong tháng hiện tại",
    set_budget: "Thiết lập ngân sách",

    // Analytics
    analytics_title: "Báo cáo & phân tích",
    analytics_subtitle: "Theo dõi cơ cấu chi tiêu, đối chiếu dòng tiền thu - chi và tỷ lệ tiết kiệm",
    net_cashflow: "Dòng tiền thuần",
    savings_rate: "Tỷ lệ tiết kiệm",

    // Settings
    settings_title: "Cài đặt hệ thống & hồ sơ",
    settings_subtitle: "Quản lý thông tin tài khoản cá nhân, tùy biến giao diện và cấu hình trợ lý AI",
    profile_info: "Thông tin tài khoản",
    appearance_mode: "Giao diện & chế độ màu",
    ai_config: "Cấu hình trợ lý AI & tự động hóa",
    light_mode: "Chế độ sáng",
    dark_mode: "Chế độ tối",
    save_settings: "Lưu cài đặt",
    security_settings: "Bảo mật & đổi mật khẩu",
    security_desc: "Cập nhật mật khẩu định kỳ để tăng cường an toàn cho tài khoản và dữ liệu tài chính của bạn",
    current_password: "Mật khẩu hiện tại",
    new_password: "Mật khẩu mới",
    confirm_new_password: "Xác nhận mật khẩu mới",
    change_password_btn: "Cập nhật mật khẩu",
    change_password_success: "Mật khẩu đã được thay đổi thành công!",
    password_mismatch: "Mật khẩu mới và mật khẩu xác nhận không trùng khớp.",
    password_min_length: "Mật khẩu mới phải có độ dài tối thiểu 6 ký tự.",
    profile_updated_success: "Thông tin hồ sơ đã được cập nhật thành công vào cơ sở dữ liệu!",
  },
  en: {
    // Brand & Common
    app_name: "Budgetly",
    app_subtitle: "Smart Personal Finance AI",
    admin_portal: "System Administration",
    live: "Live",
    active: "Active",
    search: "Search...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    retry: "Retry",
    loading: "Loading data...",
    close: "Close",
    status: "Status",
    actions: "Actions",
    time: "Time",
    all: "All",
    normal: "Normal",
    warning: "Warning",
    danger: "Danger",
    critical: "Critical",
    income: "Income",
    expense: "Expense",
    month: "Month",
    year: "Year",

    // Navigation (User)
    nav_dashboard: "Dashboard",
    nav_wallets: "Wallets",
    nav_transactions: "Transactions",
    nav_budgets: "Budgets",
    nav_analytics: "Reports & Analytics",
    nav_settings: "Settings",
    nav_admin: "System Admin",
    main_menu: "Main Menu",
    back_to_user_app: "Back to User App",

    // Navigation (Admin)
    admin_nav_dashboard: "Dashboard",
    admin_nav_users: "Users",
    admin_nav_categories: "Categories",
    admin_nav_transactions: "Transactions",
    admin_nav_budgets: "Budgets",
    admin_nav_reports: "Reports",
    admin_nav_notifications: "Notifications",
    admin_nav_audit: "Audit Logs",
    admin_nav_roles: "Roles & Permissions",
    admin_nav_settings: "System Settings",

    // Auth
    login: "Sign In",
    register: "Register",
    logout: "Sign Out",
    email: "Email address",
    password: "Password",
    full_name: "Full Name",
    dont_have_account: "Don't have an account?",
    already_have_account: "Already have an account?",
    auth_required: "Please sign in to continue",
    access_denied: "Access Denied! Admin portal is restricted to demo@budgetly.app and admin@budgetly.app.",

    // Header
    ocr_scan_btn: "Scan Invoice (OCR)",
    add_tx_btn: "Add Transaction",
    refresh: "Refresh",
    switch_theme_light: "Switch to Light Mode",
    switch_theme_dark: "Switch to Dark Mode",
    switch_lang_en: "Switch to English",
    switch_lang_vi: "Switch to Vietnamese",

    // User Dashboard
    total_balance: "Total Available Balance",
    monthly_income: "Monthly Total Income",
    monthly_expense: "Monthly Total Expense",
    budget_usage: "Budget Spending Rate",
    ai_input_placeholder: "Type or speak: 'Lunch pho 45k using cash wallet'...",
    ai_input_btn: "Add via AI",
    recent_transactions: "Recent Transactions",
    category_breakdown: "Expense Breakdown by Category",
    ai_forecast_title: "AI Financial Forecast & Alerts",
    no_transactions_yet: "No transactions recorded yet.",
    view_all: "View all",

    // Admin Dashboard
    admin_dashboard_title: "System Admin Dashboard",
    admin_dashboard_sub: "Real-time overview of system operations, infrastructure health, and core modules",
    total_users_stat: "Total Users",
    total_tx_stat: "System Transactions",
    fraud_alerts_stat: "Fraud Alerts",
    ocr_scans_stat: "OCR Invoice Scans",
    core_modules: "Core Administration Modules",
    server_infrastructure: "Server Infrastructure & Performance",
    all_nodes_operational: "All nodes operational",
    cpu_load: "CPU Usage",
    ram_allocated: "RAM Allocated",
    api_latency: "API Latency",
    recent_audit_stream: "Recent Activity Log (Audit Stream)",
    quick_actions: "Quick Admin Actions",
    broadcast_btn: "Send Broadcast Notification",
    add_category_btn: "Add New Default Category",
    create_admin_acc: "Create Admin / Auditor Account",
    backup_db_btn: "Run Database Backup Now",
    system_status: "Server Status",
    new_users_month: "new users this month",
    total_flow: "Total volume",
    requires_review: "Requires moderator review",
    ai_accuracy: "AI recognition accuracy",

    // Wallets
    wallets_title: "Financial Wallets",
    wallets_subtitle: "Manage funds, bank accounts, and digital e-wallets",
    add_wallet: "Add New Wallet",

    // Budgets
    budgets_title: "Budget Management",
    budgets_subtitle: "Configure spending caps and monitor category thresholds for the current month",
    set_budget: "Set New Budget",

    // Analytics
    analytics_title: "Reports & Analytics",
    analytics_subtitle: "Monitor category distribution, cash flow trends, and net savings rate",
    net_cashflow: "Net Cash Flow",
    savings_rate: "Savings Rate",

    // Settings
    settings_title: "Profile & System Settings",
    settings_subtitle: "Manage personal account info, theme appearance, and AI assistant configurations",
    profile_info: "User Account Information",
    appearance_mode: "Theme & Display Mode",
    ai_config: "AI Assistant & Automation Config",
    light_mode: "Light Mode",
    dark_mode: "Dark Mode",
    save_settings: "Save Preferences",
    security_settings: "Security & Change Password",
    security_desc: "Regularly update your password to enhance security for your account and financial data",
    current_password: "Current Password",
    new_password: "New Password",
    confirm_new_password: "Confirm New Password",
    change_password_btn: "Update Password",
    change_password_success: "Password has been updated successfully!",
    password_mismatch: "New password and confirmation do not match.",
    password_min_length: "New password must be at least 6 characters long.",
    profile_updated_success: "Profile info has been updated successfully to database!",
  },
};

export const categoryTranslations: Record<string, { vi: string; en: string }> = {
  "Food & Dining": { vi: "Ăn uống & nhà hàng", en: "Food & Dining" },
  "Transport & Fuel": { vi: "Di chuyển & xăng xe", en: "Transport & Fuel" },
  "Income / Salary": { vi: "Lương & thu nhập cố định", en: "Income / Salary" },
  "Salary": { vi: "Tiền lương", en: "Salary" },
  "Shopping & Fashion": { vi: "Mua sắm & thời trang", en: "Shopping & Fashion" },
  "Entertainment & Travel": { vi: "Giải trí & du lịch", en: "Entertainment & Travel" },
  "Bills & Utilities": { vi: "Hóa đơn & tiện ích", en: "Bills & Utilities" },
  "Bonuses & Freelance": { vi: "Thưởng & việc tự do", en: "Bonuses & Freelance" },
  "Investments & Crypto": { vi: "Đầu tư & tích lũy", en: "Investments & Crypto" },
  "Education": { vi: "Học tập & giáo dục", en: "Education" },
  "Healthcare": { vi: "Y tế & sức khỏe", en: "Healthcare" },
  "Gifts & Donations": { vi: "Quà tặng & từ thiện", en: "Gifts & Donations" },
  "Other Expense": { vi: "Chi phí khác", en: "Other Expense" },
  "Other Income": { vi: "Thu nhập khác", en: "Other Income" },
};

export function formatCategoryName(name: string, lang: Language): string {
  if (!name) return "";
  const directMatch = categoryTranslations[name];
  if (directMatch) {
    return directMatch[lang];
  }
  for (const item of Object.values(categoryTranslations)) {
    if (item.vi.toLowerCase() === name.toLowerCase() || item.en.toLowerCase() === name.toLowerCase()) {
      return item[lang];
    }
  }
  return name;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (stored === "vi" || stored === "en") {
        setLanguageState(stored);
      }
    } catch {
      // ignore SSR/localStorage access error
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const defaultDict = translations.vi;
    if (defaultDict && defaultDict[key]) {
      return defaultDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
