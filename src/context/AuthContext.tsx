import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUser } from "../api/authApi";
import type { User } from "../types/auth";
import { clearTokens, getAccessToken, saveTokens } from "../utils/tokenStorage";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  setAuthTokens: (access: string, refresh: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setIsLoadingUser(false);
      return;
    }

    try {
      setIsLoadingUser(true);
      const response = await getCurrentUser();
      setUser(response.data);
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  }, []);

  const setAuthTokens = useCallback((access: string, refresh: string) => {
    saveTokens(access, refresh);
  }, []);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void refreshUser();
    });
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoadingUser,
      setAuthTokens,
      logout,
      refreshUser,
    }),
    [isLoadingUser, logout, refreshUser, setAuthTokens, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
