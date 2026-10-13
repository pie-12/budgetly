"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // If already logged in, automatically redirect to the home page
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage("Please enter your email address");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your password");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage("Login successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 600);
    } else {
      setErrorMessage(result.message || "Incorrect email or password");
    }
  };

  // One-click quick-fill button for the demo account
  const handleUseDemoAccount = async () => {
    setEmail("demo@budgetly.app");
    setPassword("123456");
    setErrorMessage(null);
    setIsSubmitting(true);
    const result = await login("demo@budgetly.app", "123456");
    setIsSubmitting(false);
    if (result.success) {
      setSuccessMessage("Demo account login successful!");
      setTimeout(() => {
        router.push("/");
      }, 600);
    } else {
      setErrorMessage(result.message || "Demo account login error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background ambient decorative glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Back to Home Link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md transition-all hover:border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-2xl shadow-xl shadow-emerald-500/25 mb-4 ring-1 ring-emerald-400/30">
            B
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome Back!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Sign in to your <span className="text-emerald-400 font-semibold">Budgetly</span> account to continue managing your personal finances
          </p>
        </div>

        {/* Card Form */}
        <div className="mt-8 bg-slate-900/90 border border-slate-800/90 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl relative">
          {/* Quick Demo Login Pill */}
          <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-emerald-300 truncate">Quick Try (Demo)</p>
                <p className="text-[11px] text-slate-400 truncate">demo@budgetly.app / 123456</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUseDemoAccount}
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all shrink-0 active:scale-95 disabled:opacity-50"
            >
              1-Click Login
            </button>
          </div>

          {/* Alert Messages */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="leading-relaxed font-medium">{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative rounded-2xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500/30 accent-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-300 select-none">
                  Remember me (30 days)
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
            <p className="text-xs text-slate-400">
              Don't have a Budgetly account?{" "}
              <Link
                href="/register"
                className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors underline-offset-4 hover:underline"
              >
                Sign up for free
              </Link>
            </p>
          </div>
        </div>

        {/* Security Trust Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-slate-500 text-[11px]">
          <ShieldCheck className="w-4 h-4 text-emerald-500/70" />
          <span>Secured with Bcrypt encryption & PostgreSQL database</span>
        </div>
      </div>
    </div>
  );
}
