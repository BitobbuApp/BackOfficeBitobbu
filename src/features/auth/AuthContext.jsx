import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from './services/authApi';
import {
  clearSession,
  getStoredSession,
  getStoredToken,
  storeSession,
} from '@/lib/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(getStoredSession());
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setIsLoadingSession(false);
      return;
    }

    authApi
      .getMe()
      .then((response) => {
        const nextAdmin = response?.admin || response?.data?.admin || admin;
        if (nextAdmin) {
          storeSession({ token, admin: nextAdmin });
          setAdmin(nextAdmin);
        }
      })
      .catch(() => {
        clearSession();
        setAdmin(null);
      })
      .finally(() => {
        setIsLoadingSession(false);
      });
  }, []);

  const login = async ({ email, password }) => {
    const response = await authApi.login({ email, password });
    const token = response?.token || response?.data?.token;
    const nextAdmin = response?.admin || response?.data?.admin;

    if (!token || !nextAdmin) {
      throw new Error('Invalid login response');
    }

    storeSession({ token, admin: nextAdmin });
    setAdmin(nextAdmin);
    return nextAdmin;
  };

  const logout = () => {
    clearSession();
    setAdmin(null);
    window.location.href = '/login';
  };

  const value = useMemo(
    () => ({
      admin,
      isAuthenticated: !!admin && !!getStoredToken(),
      isLoadingSession,
      login,
      logout,
    }),
    [admin, isLoadingSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
