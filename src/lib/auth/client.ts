// lib/authClient.ts
import type { User } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class AuthClient {
  async signInWithPassword(params: { email: string; password: string }): Promise<{ error?: string }> {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const err = await res.json();
        return { error: err.message || 'Login gagal' };
      }

      return {};
    } catch {
      return { error: 'Gagal terhubung ke server' };
    }
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });
      if (!res.ok) return { data: null };
      const user = await res.json();
      return { data: user };
    } catch {
      return { data: null };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      return res.ok ? {} : { error: 'Logout gagal' };
    } catch {
      return { error: 'Gagal logout' };
    }
  }
}

export const authClient = new AuthClient();
