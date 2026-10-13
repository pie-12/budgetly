"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// URL của Core Server FastAPI
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const STORAGE_TOKEN_KEY = "budgetly_auth_token";
const STORAGE_USER_KEY = "budgetly_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Khôi phục phiên người dùng khi ứng dụng khởi chạy (F5, mở tab mới)
  const initializeAuth = useCallback(async () => {
    try {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      const storedUser = localStorage.getItem(STORAGE_USER_KEY);

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      // Tạm thời load cached user để giao diện mượt mà không bị giật
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          // ignore parse error
        }
      }
      setToken(storedToken);

      // Gọi server xác thực tính hợp lệ của token
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setUser(json.data);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(json.data));
        }
      } else if (res.status === 401) {
        // Token đã hết hạn hoặc không hợp lệ -> xóa sạch phiên
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.warn("Không thể xác thực phiên với server (chế độ offline):", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Đăng nhập
  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.detail || data.message || "Đăng nhập không thành công";
        return { success: false, message: errorMsg };
      }

      if (data.data?.access_token) {
        const accessToken = data.data.access_token;
        const userData = data.data.user;

        localStorage.setItem(STORAGE_TOKEN_KEY, accessToken);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));

        setToken(accessToken);
        setUser(userData);

        return { success: true, message: data.message || "Đăng nhập thành công" };
      }

      return { success: false, message: "Phản hồi từ máy chủ không hợp lệ" };
    } catch (err) {
      console.error("Lỗi kết nối khi đăng nhập:", err);
      return { success: false, message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng." };
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng ký
  const register = async (
    email: string,
    password: string,
    fullName?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          full_name: fullName?.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.detail || data.message || "Đăng ký không thành công";
        return { success: false, message: errorMsg };
      }

      if (data.data?.access_token) {
        const accessToken = data.data.access_token;
        const userData = data.data.user;

        localStorage.setItem(STORAGE_TOKEN_KEY, accessToken);
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));

        setToken(accessToken);
        setUser(userData);

        return { success: true, message: data.message || "Đăng ký tài khoản thành công" };
      }

      return { success: false, message: "Phản hồi từ máy chủ không hợp lệ" };
    } catch (err) {
      console.error("Lỗi kết nối khi đăng ký:", err);
      return { success: false, message: "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng." };
    } finally {
      setIsLoading(false);
    }
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setUser(null);
    setToken(null);
    router.push("/login");
  };

  // Làm mới thông tin user từ server
  const refreshUser = async () => {
    const currentToken = token || localStorage.getItem(STORAGE_TOKEN_KEY);
    if (!currentToken) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/auth/me`, {
        headers: {
          "Authorization": `Bearer ${currentToken}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setUser(data.data);
          localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.data));
        }
      }
    } catch (err) {
      console.error("Lỗi làm mới profile:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }
  return context;
}
