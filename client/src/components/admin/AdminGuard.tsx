"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { ShieldAlert, ArrowLeft, Loader2, LogIn } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        <p className="text-sm font-medium">{t("loading")}</p>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {language === "vi" ? "Yêu cầu đăng nhập" : "Authentication Required"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {language === "vi"
                ? "Vui lòng đăng nhập với tài khoản quản trị viên (demo@budgetly.app hoặc admin@budgetly.app) để tiếp tục."
                : "Please sign in with an Administrator account (demo@budgetly.app or admin@budgetly.app) to access the system portal."}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("back_to_user_app")}</span>
            </Link>
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{t("login")}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logged in but not in allowed admin emails
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 font-sans">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {language === "vi" ? "Từ chối quyền truy cập (403)" : "Access Denied (403)"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {language === "vi"
                ? `Tài khoản (${user.email}) không có quyền truy cập trang quản trị. Chức năng này chỉ cấp quyền cho demo@budgetly.app và admin@budgetly.app.`
                : `Account (${user.email}) does not have admin permissions. Restricted to demo@budgetly.app and admin@budgetly.app.`}
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t("back_to_user_app")}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
