// lib/authClient.ts
import type { User } from '@/types/user';
import API from './axio-client'; // pastikan path sesuai

class AuthClient {
  async signInWithPassword(params: { email: string; password: string }): Promise<{ error?: string }> {
    try {
      await API.post('/auth/login', params); // credentials: true sudah otomatis dari axios instance
      return {};
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login gagal';
      return { error: message };
    }
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      const res = await API.get('/auth/me');
      return { data: res.data };
    } catch {
      return { data: null };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      const res = await API.post('/auth/logout');
      return res.status === 200 ? {} : { error: 'Logout gagal' };
    } catch {
      return { error: 'Gagal logout' };
    }
  }
}

export const authClient = new AuthClient();
