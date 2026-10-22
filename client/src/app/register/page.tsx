"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
  Sun,
  Moon,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên của bạn");
      return;
    }
    if (!email.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ email");
      return;
    }
    if (!password) {
      setErrorMessage("Vui lòng nhập mật khẩu");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Mật khẩu phải có tối thiểu 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Mật khẩu xác nhận không khớp với mật khẩu đã nhập");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("Vui lòng đồng ý với Điều khoản sử dụng & Chính sách bảo mật");
      return;
    }

    setIsSubmitting(true);
    const result = await register(email, password, fullName);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage("Đăng ký tài khoản thành công! Đang chuyển hướng...");
      setTimeout(() => {
        router.push("/");
      }, 700);
    } else {
      setErrorMessage(result.message || "Đăng ký không thành công");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans transition-colors duration-200">
      {/* Background ambient decorative glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Controls: Back & Theme Toggle */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3.5 py-2 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md transition-all shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Trang Chủ</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Chuyển sang giao diện Sáng" : "Chuyển sang giao diện Tối"}
          className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white backdrop-blur-md shadow-xs transition-all active:scale-95"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.8} />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" strokeWidth={1.8} />
          )}
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-extrabold text-2xl shadow-lg shadow-emerald-500/25 mb-4">
            B
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Tạo Tài Khoản Mới
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Khởi đầu quản lý tài chính thông minh cùng <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Budgetly AI</span>
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-7 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-xl rounded-3xl relative transition-colors duration-200">
          {/* Alert Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" strokeWidth={1.8} />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={1.8} />
              <span className="leading-relaxed font-medium">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Họ và Tên
              </label>
              <div className="relative rounded-2xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative rounded-2xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Mật khẩu (Tối thiểu 6 ký tự)
              </label>
              <div className="relative rounded-2xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" strokeWidth={1.8} /> : <Eye className="w-4 h-4" strokeWidth={1.8} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Xác nhận Mật khẩu
              </label>
              <div className="relative rounded-2xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Terms Agreement */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-emerald-600 focus:ring-emerald-500/30 accent-emerald-600 cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400 select-none leading-relaxed">
                  Tôi đồng ý với{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Điều khoản dịch vụ</span>{" "}
                  và{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Chính sách bảo mật</span>{" "}
                  của Budgetly
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang đăng ký tài khoản...</span>
                </>
              ) : (
                <>
                  <span>Tạo Tài Khoản Mới</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Đã có tài khoản Budgetly?{" "}
              <Link
                href="/login"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Security Trust Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-500" strokeWidth={1.8} />
          <span>Tự động tạo Ví & Bộ danh mục thu chi mặc định</span>
        </div>
      </div>
    </div>
  );
}
