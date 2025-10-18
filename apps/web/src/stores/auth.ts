import { create } from 'zustand';
import { getStoredTokens, setStoredTokens, apiFetch, AuthTokens } from '../lib/api';

type User = { id: string; email: string; username: string } | null;

type AuthState = {
  user: User;
  tokens: AuthTokens | null;
  setTokens: (t: AuthTokens | null) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  tokens: getStoredTokens(),
  setTokens: (tokens) => {
    setStoredTokens(tokens);
    set({ tokens });
  },
  logout: () => {
    setStoredTokens(null);
    set({ tokens: null, user: null });
  }
}));

export async function login(email: string, password: string) {
  const res = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  useAuth.getState().setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
}

export async function registerUser(payload: { email: string; username: string; password: string }) {
  const res = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return res.json();
}

export async function refreshTokens() {
  const tokens = getStoredTokens();
  if (!tokens?.refreshToken) return null;
  const res = await apiFetch('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken: tokens.refreshToken })
  });
  const data = await res.json();
  useAuth.getState().setTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
  return data as AuthTokens;
}
