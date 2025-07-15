'use client';
import * as React from 'react';
import type { User } from '@/types/user';
import { authClient } from '@/lib/auth/client';

export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const checkSession = async () => {
    setIsLoading(true);
    const { data, error } = await authClient.getUser();
    setUser(data ?? null);
    setError(error ?? null);
    setIsLoading(false);
  };

  React.useEffect(() => {
    checkSession();
  }, []);

  const value = React.useMemo(() => ({ user, error, isLoading, checkSession }), [user, error, isLoading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
