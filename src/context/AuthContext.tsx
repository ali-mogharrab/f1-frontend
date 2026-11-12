import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { getCurrentUser } from "../api/authApi";
import type { User } from "../types/auth";
import { clearTokens, getAccessToken, getAuthSession, saveTokens, SESSION_EXPIRED_EVENT } from "../utils/tokenStorage";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  setAuthTokens: (access: string, refresh: string) => void;
  logout: (reason?: "expired") => void;
  sessionExpired: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const queryClient = useQueryClient();
  const requestVersion = useRef(0);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const refreshUser = useCallback(async () => {
    const version = ++requestVersion.current;
    const session = getAuthSession();
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      setIsLoadingUser(false);
      return;
    }

    try {
      setIsLoadingUser(true);
      const response = await getCurrentUser();
      if (version === requestVersion.current && session === getAuthSession()) setUser(response.data);
    } catch (error) {
      if (version !== requestVersion.current || session !== getAuthSession()) return;
      if (axios.isAxiosError(error) && [401, 403].includes(error.response?.status ?? 0)) clearTokens();
      setUser(null);
    } finally {
      if (version === requestVersion.current) setIsLoadingUser(false);
    }
  }, []);

  const setAuthTokens = useCallback((access: string, refresh: string) => {
    requestVersion.current++;
    queryClient.clear();
    setUser(null);
    saveTokens(access, refresh);
    setSessionExpired(false);
  }, [queryClient]);

  const logout = useCallback((reason?: "expired") => {
    requestVersion.current++;
    clearTokens();
    queryClient.clear();
    setUser(null);
    setIsLoadingUser(false);
    setSessionExpired(reason === "expired");
  }, [queryClient]);

  useEffect(() => {
    const expired = () => logout("expired");
    const storageChanged = (event: StorageEvent) => {
      if (event.key === "f1_refresh_token" || event.key === null) {
        requestVersion.current++;
        queryClient.clear();
        setUser(null);
        void refreshUser();
      }
    };
    window.addEventListener(SESSION_EXPIRED_EVENT, expired);
    window.addEventListener("storage", storageChanged);
    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, expired);
      window.removeEventListener("storage", storageChanged);
    };
  }, [logout, queryClient, refreshUser]);

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
      sessionExpired,
    }),
    [isLoadingUser, logout, refreshUser, setAuthTokens, user, sessionExpired],
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
