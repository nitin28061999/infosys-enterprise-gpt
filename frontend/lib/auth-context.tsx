"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  authApi,
  setToken,
  decodeToken,
  type UserResponse,
  type TokenPayload,
} from "@/lib/api";

interface AuthUser extends UserResponse {
  role: TokenPayload["role"];
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    department: UserResponse["department"],
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("auth_token");
}

async function loadUserFromToken(token: string): Promise<AuthUser | null> {
  const payload = decodeToken(token);
  if (!payload) return null;
  if (payload.exp * 1000 < Date.now()) return null;

  const details = await authApi.getUser(payload.id);
  return { ...details, role: payload.role };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setLoading(false);
      return;
    }

    loadUserFromToken(token)
      .then(setUser)
      .catch(() => {
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { access_token } = await authApi.signin(email, password);
    setToken(access_token);
    const me = await loadUserFromToken(access_token);
    setUser(me);
  }

  async function signup(
    name: string,
    email: string,
    department: UserResponse["department"],
    password: string
  ) {
    await authApi.signup({ name, email, department, password });
    await login(email, password);
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
