/**
 * Central API client — matches the REAL backend routes in backend/src
 * (one router per feature folder), verified directly against the repo.
 * Every network call in the app goes through this file.
 *
 * Base URL comes from NEXT_PUBLIC_API_URL (see .env.local.example).
 *
 * Known backend gaps (routes that do not exist yet — see BACKEND_GAPS.md):
 *   - No GET /api/auth/me            -> current user is derived from the JWT
 *     (id, role, department only) + a GET /api/user/{id} call for name/email
 *   - No forgot-password endpoint
 *   - No dashboard stats/activity endpoints
 *   - No admin roles/connectors/audit-log endpoints
 *   - No settings (profile/password/notifications/theme) endpoints
 * Calls for these are intentionally omitted below rather than pointed at
 * fake paths -- the pages that need them show an honest "not available yet"
 * state. See BACKEND_GAPS.md for the full list.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL && typeof window !== "undefined") {
  console.error(
    "NEXT_PUBLIC_API_URL is not set. Create frontend/.env.local from .env.local.example."
  );
}

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

/**
 * Decodes a JWT payload without verifying the signature (verification
 * happens server-side on every request). Backend token payload shape:
 * { id: number, role: "ADMIN" | "KNOWLEDGE_OWNER" | "EMPLOYEE", department: string, exp: number }
 */
export interface TokenPayload {
  id: number;
  role: "ADMIN" | "KNOWLEDGE_OWNER" | "EMPLOYEE";
  department: string;
  exp: number;
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
}

async function parseErrorBody(res: Response): Promise<string> {
  try {
    const body = await res.json();
    return body.detail ?? body.message ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

async function requestRaw(path: string, options: RequestInit = {}): Promise<Response> {
  if (!API_BASE_URL) throw new ApiError("API base URL is not configured", 0);

  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    throw new ApiError(await parseErrorBody(res), res.status);
  }

  return res;
}

async function requestEnvelope<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await requestRaw(path, options);
  const body: Envelope<T> = await res.json();
  return body.data;
}

async function requestPlain<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await requestRaw(path, options);
  return res.json();
}

// ---------- Auth ----------
// POST /api/auth/signin expects OAuth2PasswordRequestForm -- a
// form-urlencoded body with "username" (the email) and "password", NOT JSON.

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export type Department =
  | "HR"
  | "ENGINEERING"
  | "FINANCE"
  | "SALES"
  | "MARKETING"
  | "LEGAL"
  | "OPERATIONS"
  | "IT"
  | "PROCUREMENT";

export interface SignupPayload {
  name: string;
  email: string;
  department: Department;
  password: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  department: Department;
}

export const authApi = {
  signin: (email: string, password: string) => {
    const form = new URLSearchParams();
    form.set("username", email);
    form.set("password", password);

    return requestEnvelope<TokenResponse>("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
  },

  // Public signup always creates an EMPLOYEE account. /api/auth/signup/admin
  // and /api/auth/signup/knowledgeOwner exist on the backend but are not
  // exposed here deliberately -- see BACKEND_GAPS.md (those routes currently
  // have no auth guard at all, a backend-side issue to fix first).
  signup: (payload: SignupPayload) =>
    requestEnvelope<UserResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // No GET /api/auth/me on the backend. Current user = decode the JWT for
  // {id, role, department}, then fetch the rest via getUser(id).
  getUser: (id: number) => requestEnvelope<UserResponse>(`/api/user/${id}`),
};

// ---------- Query / Chat ----------
// POST /api/query/ returns the raw object directly (no envelope). There is
// no endpoint to fetch prior chat history.

export interface Citation {
  rank?: number;
  document_id?: number;
  document_name?: string;
  department?: string;
  owner?: string;
  page_number?: number;
  text?: string;
}

export interface QueryResponse {
  answer: string;
  confidence_score: number;
  citations: Citation[];
  recommended_action?: string;
}

export const queryApi = {
  ask: (question: string) =>
    requestPlain<QueryResponse>("/api/query/", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),
};

// ---------- Documents ----------
// POST /api/document/ is multipart/form-data, restricted to
// ADMIN / KNOWLEDGE_OWNER roles on the backend.

export type DocumentType =
  | "SOP"
  | "HR_POLICY"
  | "PROJECT_MANUAL"
  | "ENGINEERING_GUIDE"
  | "SALES_DOCUMENT"
  | "OTHER";

export type Confidentiality = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";
export type AccessScope = "ALL" | "DEPARTMENT" | "OWNER";
export type DocumentStatus = "UPLOADED" | "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface DocumentUploadPayload {
  title: string;
  department: string;
  owner: string;
  document_type: DocumentType;
  confidentiality: Confidentiality;
  access_scope: AccessScope;
  source_system?: boolean;
}

export interface DocumentData extends DocumentUploadPayload {
  id: number;
  file_path: string;
  status: DocumentStatus;
  uploaded_at: string;
  updated_at: string;
}

export const documentApi = {
  upload: (file: File, payload: DocumentUploadPayload) => {
    const form = new FormData();
    form.append("file", file);
    form.append("title", payload.title);
    form.append("department", payload.department);
    form.append("owner", payload.owner);
    form.append("document_type", payload.document_type);
    form.append("confidentiality", payload.confidentiality);
    form.append("access_scope", payload.access_scope);
    if (payload.source_system !== undefined) {
      form.append("source_system", String(payload.source_system));
    }

    return requestEnvelope<DocumentData>("/api/document/", {
      method: "POST",
      body: form,
    });
  },

  list: () => requestEnvelope<DocumentData[]>("/api/document/"),

  ingestionStatus: (documentId: number) =>
    requestEnvelope<{ document_id: number; status: string }>(
      `/api/document/ingestion-status/${documentId}`
    ),
};

// ---------- Analytics ----------
// GET /api/analytics/ is ADMIN-ONLY and returns a flat, unwrapped object.

export interface AnalyticsMetrics {
  total_documents: number;
  completed_documents: number;
  failed_documents: number;
  total_queries: number;
  successful_answers: number;
  no_answer: number;
  total_feedback: number;
  helpful_feedback: number;
  not_helpful_feedback: number;
  average_response_time: number;
}

export const analyticsApi = {
  getMetrics: () => requestPlain<AnalyticsMetrics>("/api/analytics/"),
};

// ---------- Users (admin) ----------
// GET /api/user/ is ADMIN-ONLY.

export const adminApi = {
  getUsers: () => requestEnvelope<UserResponse[]>("/api/user/"),
};

// ---------- Feedback ----------

export type Rating = "HELPFUL" | "NOT_HELPFUL";

export interface FeedbackData {
  id: number;
  user_id: number;
  audit_id: number | null;
  rating: Rating;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export const feedbackApi = {
  submit: (rating: Rating, comment?: string, auditId?: number) =>
    requestEnvelope<FeedbackData>("/api/feedback/", {
      method: "POST",
      body: JSON.stringify({ rating, comment, audit_id: auditId }),
    }),
};
