export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export function getStoredTokens(): AuthTokens | null {
  try {
    const raw = localStorage.getItem('auth:tokens');
    return raw ? (JSON.parse(raw) as AuthTokens) : null;
  } catch {
    return null;
  }
}

export function setStoredTokens(tokens: AuthTokens | null) {
  if (!tokens) {
    localStorage.removeItem('auth:tokens');
    return;
  }
  localStorage.setItem('auth:tokens', JSON.stringify(tokens));
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}) {
  const tokens = getStoredTokens();
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (tokens?.accessToken) headers.set('Authorization', `Bearer ${tokens.accessToken}`);
  let res = await fetch(input, { ...init, headers });
  if (res.status === 401) {
    // try refresh once
    try {
      const stored = getStoredTokens();
      if (stored?.refreshToken) {
        const r = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken: stored.refreshToken })
        });
        if (r.ok) {
          const data = (await r.json()) as AuthTokens;
          setStoredTokens(data);
          const retryHeaders = new Headers(init.headers);
          retryHeaders.set('Content-Type', 'application/json');
          retryHeaders.set('Authorization', `Bearer ${data.accessToken}`);
          res = await fetch(input, { ...init, headers: retryHeaders });
        }
      }
    } catch {}
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res;
}
