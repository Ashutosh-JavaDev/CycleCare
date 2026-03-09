function normalizeConfiguredBase(rawBase: string) {
  const noTrail = rawBase.replace(/\/$/, '');
  return noTrail.replace(/\/api$/, '');
}

function resolveApiCandidates() {
  const configured = String(import.meta.env.VITE_API_URL || '').trim();
  if (configured) {
    return [`${normalizeConfiguredBase(configured)}/api`];
  }

  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Production deployments should hit same-origin API unless explicitly configured.
    return [`${window.location.origin}/api`];
  }

  return ['http://localhost:4000/api'];
}

const API_CANDIDATES = resolveApiCandidates();

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string;
};

async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let lastError: Error | null = null;

  for (let i = 0; i < API_CANDIDATES.length; i += 1) {
    const base = API_CANDIDATES[i];
    let response: Response;

    try {
      response = await fetch(`${base}${path}`, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        },
        ...(options.body ? { body: JSON.stringify(options.body) } : {}),
      });
    } catch {
      const hasConfig = String(import.meta.env.VITE_API_URL || '').trim().length > 0;
      lastError = new Error(
        hasConfig
          ? `Failed to reach API at ${base}. Check backend/CORS/server status.`
          : 'Failed to reach API. Set VITE_API_URL to your deployed backend URL.'
      );
      continue;
    }

    const rawText = await response.text();
    let data: Record<string, unknown> = {};
    if (rawText) {
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { message: rawText };
      }
    }

    // If same-origin does not host the API, try next fallback base.
    if (response.status === 404 && i < API_CANDIDATES.length - 1) {
      continue;
    }

    if (!response.ok) {
      const message = typeof data.message === 'string' && data.message.trim().length > 0
        ? data.message
        : `Request failed (${response.status}) for ${path}`;
      throw new Error(message);
    }

    return data as T;
  }

  throw lastError || new Error('Failed to fetch: API server is unreachable.');
}

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  age: number;
  cycle_length: number;
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  age: number;
  cycleLength?: number;
}) {
  return apiRequest<AuthResponse>('/auth/register', { method: 'POST', body: payload });
}

export function loginUser(payload: { email: string; password: string }) {
  return apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: payload });
}

export function fetchCurrentUser(token: string) {
  return apiRequest<{ user: AuthUser }>('/auth/me', { token });
}

export function sendSignupOtp(payload: { email: string }) {
  return apiRequest<{ message: string; devOtp?: string }>('/auth/send-otp', { method: 'POST', body: payload });
}

export function verifySignupOtp(payload: { email: string; otp: string }) {
  return apiRequest<{ message: string; verified: boolean }>('/auth/verify-otp', { method: 'POST', body: payload });
}

export type ServiceStatus = {
  api: boolean;
  db: boolean;
  smtpConfigured: boolean;
  smtpConnected: boolean;
  message?: string;
};

export function getServiceStatus() {
  return apiRequest<ServiceStatus>('/health/dependencies');
}
