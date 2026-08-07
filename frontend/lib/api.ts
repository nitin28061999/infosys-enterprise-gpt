/**
 * Central API client.
 *
 * Every network call in the app goes through this file. Nothing else should
 * hardcode a URL, a fetch() call, or mock data — components/pages call one
 * of the functions below and render whatever comes back, with loading/error
 * state handled at the call site.
 *
 * Base URL comes from NEXT_PUBLIC_API_URL (see .env.local.example). It is
 * never hardcoded in a component or page.
 *
 * NOTE: endpoint paths below are REST conventions inferred from the UI —
 * your backend/ routes for these aren't pushed yet. Once ai_workflows/ and
 * backend/app/api land, update the ENDPOINTS map to match the real FastAPI
 * paths; every caller picks the change up automatically.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL && typeof window !== "undefined") {
  console.error(
    "NEXT_PUBLIC_API_URL is not set. Create frontend/.env.local from .env.local.example."
  );
}

const ENDPOINTS = {
  login: "/api/auth/login",
  signup: "/api/auth/signup",
  forgotPassword: "/api/auth/forgot-password",
  me: "/api/auth/me",

  chatMessages: "/api/chat/messages",
  chatSend: "/api/chat/send",

  dashboardStats: "/api/dashboard/stats",
  dashboardActivity: "/api/dashboard/activity",

  analyticsSummary: "/api/analytics/summary",

  adminUsers: "/api/admin/users",
  adminRoles: "/api/admin/roles",
  adminConnectors: "/api/admin/connectors",
  adminAudit: "/api/admin/audit",
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("auth_token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem("auth_token", token);
  else window.localStorage.removeItem("auth_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError("API base URL is not configured", 0);
  }

  const token = getToken();

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.detail ?? body.message ?? message;
    } catch {
      // response wasn't JSON, keep statusText
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---------- Auth ----------

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Knowledge Owner" | "Employee";
}

export const authApi = {
  login: (email: string, password: string) =>
    request<LoginResponse>(ENDPOINTS.login, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  signup: (name: string, email: string, password: string) =>
    request<LoginResponse>(ENDPOINTS.signup, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  forgotPassword: (email: string) =>
    request<{ message: string }>(ENDPOINTS.forgotPassword, {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  me: () => request<CurrentUser>(ENDPOINTS.me),
};

// ---------- Chat ----------

export interface Citation {
  title: string;
  page: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  message: string;
  citations?: Citation[];
  created_at: string;
}

export const chatApi = {
  getMessages: (conversationId?: string) =>
    request<ChatMessage[]>(
      conversationId
        ? `${ENDPOINTS.chatMessages}?conversation_id=${conversationId}`
        : ENDPOINTS.chatMessages
    ),

  send: (message: string, conversationId?: string) =>
    request<ChatMessage>(ENDPOINTS.chatSend, {
      method: "POST",
      body: JSON.stringify({ message, conversation_id: conversationId }),
    }),
};

// ---------- Dashboard ----------

export interface StatCardData {
  title: string;
  value: string;
  change: string;
}

export interface WeeklyPoint {
  label: string;
  value: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
}

export interface DashboardStats {
  cards: StatCardData[];
  weeklyQueries: WeeklyPoint[];
}

export const dashboardApi = {
  getStats: () => request<DashboardStats>(ENDPOINTS.dashboardStats),
  getActivity: () => request<ActivityItem[]>(ENDPOINTS.dashboardActivity),
};

// ---------- Analytics ----------

export interface AnalyticsCardData {
  title: string;
  value: string;
  subtitle: string;
}

export interface MonthlyPoint {
  month: string;
  value: number;
}

export interface DepartmentUsage {
  name: string;
  usage: number;
}

export interface FeedbackBreakdown {
  positive: number;
  neutral: number;
  negative: number;
}

export interface AnalyticsSummary {
  cards: AnalyticsCardData[];
  queryVolume: MonthlyPoint[];
  usage: DepartmentUsage[];
  feedback: FeedbackBreakdown;
}

export const analyticsApi = {
  getSummary: () => request<AnalyticsSummary>(ENDPOINTS.analyticsSummary),
};

// ---------- Admin ----------

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface RoleSummary {
  title: string;
  users: number;
  description: string;
}

export interface ConnectorStatus {
  name: string;
  status: "Connected" | "Disconnected";
  description: string;
}

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  time: string;
}

export const adminApi = {
  getUsers: () => request<AdminUser[]>(ENDPOINTS.adminUsers),
  getRoles: () => request<RoleSummary[]>(ENDPOINTS.adminRoles),
  getConnectors: () => request<ConnectorStatus[]>(ENDPOINTS.adminConnectors),
  getAuditLog: () => request<AuditEntry[]>(ENDPOINTS.adminAudit),
};

// ---------- Upload ----------

export interface UploadedDocument {
  id: string;
  filename: string;
  status: "processing" | "indexed" | "failed";
  uploaded_at: string;
}

export const uploadApi = {
  uploadDocument: async (file: File): Promise<UploadedDocument> => {
    if (!API_BASE_URL) throw new ApiError("API base URL is not configured", 0);
    const token = getToken();

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: formData,
    });

    if (!res.ok) {
      let message = res.statusText;
      try {
        const body = await res.json();
        message = body.detail ?? body.message ?? message;
      } catch {
        // not JSON
      }
      throw new ApiError(message, res.status);
    }

    return res.json();
  },

  listDocuments: () => request<UploadedDocument[]>("/api/documents"),
};

// ---------- Settings ----------

export interface NotificationPreferences {
  email: boolean;
  system: boolean;
  updates: boolean;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  theme: "Light" | "Dark" | "System";
}

export const settingsApi = {
  getPreferences: () => request<UserPreferences>("/api/settings/preferences"),

  updateProfile: (name: string, email: string) =>
    request<CurrentUser>("/api/settings/profile", {
      method: "PATCH",
      body: JSON.stringify({ name, email }),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>("/api/settings/password", {
      method: "POST",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    }),

  updateNotifications: (prefs: NotificationPreferences) =>
    request<NotificationPreferences>("/api/settings/notifications", {
      method: "PATCH",
      body: JSON.stringify(prefs),
    }),

  updateTheme: (theme: UserPreferences["theme"]) =>
    request<{ theme: string }>("/api/settings/theme", {
      method: "PATCH",
      body: JSON.stringify({ theme }),
    }),
};
