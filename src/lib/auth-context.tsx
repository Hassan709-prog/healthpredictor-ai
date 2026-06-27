import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, getToken, setToken, clearToken, getStoredUser, setStoredUser, type User, type AuthResponse } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; name: string; password: string; age?: number; gender?: string }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser);
  const [token, setTokenState] = useState<string | null>(getToken);
  const [isLoading, setIsLoading] = useState(false);

  const applyAuth = (res: AuthResponse) => {
    setToken(res.access_token);
    setStoredUser(res.user);
    setTokenState(res.access_token);
    setUser(res.user);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(email, password);
      applyAuth(res);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: { email: string; name: string; password: string; age?: number; gender?: string }) => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(payload);
      applyAuth(res);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setTokenState(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const u = await api.auth.me();
      setUser(u);
      setStoredUser(u);
    } catch {
      logout();
    }
  }, [logout]);

  // On mount, if we have a token validate it
  useEffect(() => {
    if (token && !user) {
      refreshUser();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
