const TOKEN_KEY = 'bitobbu_admin_token';
const SESSION_KEY = 'bitobbu_admin_session';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function storeSession({ token, admin }) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(SESSION_KEY, JSON.stringify(admin));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(SESSION_KEY);
}
