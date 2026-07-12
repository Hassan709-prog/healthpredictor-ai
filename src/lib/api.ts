// Central API client for HealthPredictor AI backend
// Base URL reads from Vite env var, falls back to localhost

const BASE_URL = import.meta.env.PROD 
  ? "https://healthpredictor-ai-production.up.railway.app" 
  : "http://127.0.0.1:8000";

// ─────────────────── Token helpers ───────────────────

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hp_token");
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("hp_token", token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("hp_token");
  localStorage.removeItem("hp_user");
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("hp_user");
  return raw ? (JSON.parse(raw) as User) : null;
}

export function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("hp_user", JSON.stringify(user));
}

// ─────────────────── Types ───────────────────

export interface User {
  id: number;
  email: string;
  name: string;
  age: number | null;
  gender: string | null;
  role: "user" | "admin";
  status: "Active" | "Suspended";
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Prediction {
  id: number;
  user_id: number;
  symptoms: string; // JSON string
  disease: string;
  confidence: number | null;
  recommendations: string;
  severity_log: string | null;
  created_at: string;
}

export interface SymptomDetail {
  name: string;
  severity: string;
  duration: string;
}

export interface Specialist {
  id: number;
  name: string;
  specialty: string;
  location: string | null;
  contact: string | null;
  rating: number | null;
  image_url: string | null;
}

export interface JournalEntry {
  id: number;
  user_id: number;
  date: string;
  temperature: number | null;
  blood_pressure: string | null;
  mood: string | null;
  created_at: string;
}

export interface Symptom {
  id: number;
  name: string;
}

export interface Disease {
  id: number;
  name: string;
  description: string | null;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  suspended_users: number;
  total_predictions: number;
  total_symptoms: number;
  total_diseases: number;
}

// ─────────────────── Fetch wrapper ───────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = true,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      data?.detail ??
      (Array.isArray(data?.detail)
        ? data.detail.map((e: { msg: string }) => e.msg).join(", ")
        : "An error occurred.");
    throw new Error(typeof message === "string" ? message : JSON.stringify(message));
  }

  return data as T;
}

// ─────────────────── Auth ───────────────────

export const api = {
  auth: {
    async register(payload: {
      email: string;
      name: string;
      password: string;
      age?: number;
      gender?: string;
    }): Promise<AuthResponse> {
      return request<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }, false);
    },

    async login(email: string, password: string): Promise<AuthResponse> {
      return request<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }, false);
    },

    async me(): Promise<User> {
      return request<User>("/api/auth/me");
    },

    async updateMe(payload: {
      name?: string;
      age?: number;
      gender?: string;
      password?: string;
    }): Promise<User> {
      return request<User>("/api/auth/me", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
  },

  // ─────────────────── Predict ───────────────────

  predict: {
    async run(symptoms: string[], symptom_details?: SymptomDetail[]): Promise<Prediction> {
      return request<Prediction>("/api/predict/", {
        method: "POST",
        body: JSON.stringify({ symptoms, symptom_details }),
      });
    },

    async history(skip = 0, limit = 50): Promise<Prediction[]> {
      return request<Prediction[]>(`/api/predict/history?skip=${skip}&limit=${limit}`);
    },

    async get(id: number): Promise<Prediction> {
      return request<Prediction>(`/api/predict/history/${id}`);
    },

    async delete(id: number): Promise<void> {
      return request<void>(`/api/predict/history/${id}`, { method: "DELETE" });
    },

    async symptoms(): Promise<Symptom[]> {
      return request<Symptom[]>("/api/predict/symptoms", {}, false);
    },
  },

  // ─────────────────── Admin ───────────────────

  admin: {
    async stats(): Promise<AdminStats> {
      return request<AdminStats>("/api/admin/stats");
    },

    // Users
    async users(skip = 0, limit = 100): Promise<User[]> {
      return request<User[]>(`/api/admin/users?skip=${skip}&limit=${limit}`);
    },
    async getUser(id: number): Promise<User> {
      return request<User>(`/api/admin/users/${id}`);
    },
    async updateUser(
      id: number,
      payload: { name?: string; age?: number; gender?: string; status?: string; role?: string },
    ): Promise<User> {
      return request<User>(`/api/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
    async deleteUser(id: number): Promise<void> {
      return request<void>(`/api/admin/users/${id}`, { method: "DELETE" });
    },

    // Predictions
    async predictions(skip = 0, limit = 100): Promise<Prediction[]> {
      return request<Prediction[]>(`/api/admin/predictions?skip=${skip}&limit=${limit}`);
    },
    async deletePrediction(id: number): Promise<void> {
      return request<void>(`/api/admin/predictions/${id}`, { method: "DELETE" });
    },

    // Symptoms
    async symptoms(): Promise<Symptom[]> {
      return request<Symptom[]>("/api/admin/symptoms");
    },
    async createSymptom(name: string): Promise<Symptom> {
      return request<Symptom>("/api/admin/symptoms", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
    },
    async updateSymptom(id: number, name: string): Promise<Symptom> {
      return request<Symptom>(`/api/admin/symptoms/${id}`, {
        method: "PUT",
        body: JSON.stringify({ name }),
      });
    },
    async deleteSymptom(id: number): Promise<void> {
      return request<void>(`/api/admin/symptoms/${id}`, { method: "DELETE" });
    },

    // Diseases
    async diseases(): Promise<Disease[]> {
      return request<Disease[]>("/api/admin/diseases");
    },
    async createDisease(name: string, description?: string): Promise<Disease> {
      return request<Disease>("/api/admin/diseases", {
        method: "POST",
        body: JSON.stringify({ name, description }),
      });
    },
    async updateDisease(id: number, payload: { name?: string; description?: string }): Promise<Disease> {
      return request<Disease>(`/api/admin/diseases/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
    async deleteDisease(id: number): Promise<void> {
      return request<void>(`/api/admin/diseases/${id}`, { method: "DELETE" });
    },
  },

  // ─────────────────── Specialists ───────────────────

  specialist: {
    async getForDisease(disease: string): Promise<Specialist[]> {
      return request<Specialist[]>(`/api/specialist/?disease=${encodeURIComponent(disease)}`, {}, false);
    }
  },

  // ─────────────────── Journal ───────────────────

  journal: {
    async create(payload: { date: string; temperature?: number; blood_pressure?: string; mood?: string }): Promise<JournalEntry> {
      return request<JournalEntry>("/api/journal/", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    },
    async list(): Promise<JournalEntry[]> {
      return request<JournalEntry[]>("/api/journal/");
    }
  }
};
