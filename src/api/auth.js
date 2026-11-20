const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Thin wrapper around the backend auth endpoints.
 * Returns { ok, status, data } so callers can react to status codes.
 */
async function authRequest(path, body) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    // Network failure — backend not running, CORS blocked, etc.
    return { ok: false, status: 0, data: {} };
  }
}

export function signupUser({ name, email, password, favouriteHero }) {
  return authRequest("/api/auth/signup", { name, email, password, favouriteHero });
}

export function loginUser({ email, password }) {
  return authRequest("/api/auth/login", { email, password });
}

/**
 * Loads the authenticated user's profile (GET /api/me) with a bearer JWT.
 * Returns { ok, status, data } — data.user = { id, name, email, favouriteHero }.
 */
export async function fetchProfile(token) {
  try {
    const res = await fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch {
    // Network failure — backend not running, CORS blocked, etc.
    return { ok: false, status: 0, data: {} };
  }
}
