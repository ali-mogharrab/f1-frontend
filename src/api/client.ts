import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  clearTokens,
  getAccessToken,
  getAuthSession,
  getRefreshToken,
  saveAccessToken,
  SESSION_EXPIRED_EVENT,
} from "../utils/tokenStorage";

type SessionRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _authSession?: string;
};

const anonymousEndpoints = new Set([
  "/users/token/", "/users/token/refresh/", "/users/token/verify/",
  "/users/register/", "/users/password/reset/", "/users/password/reset/confirm/",
]);

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

function assertSession(config: SessionRequest) {
  if (config._authSession !== undefined && config._authSession !== getAuthSession()) {
    throw new axios.CanceledError("The account session changed.");
  }
}

function expireSession(session: string | undefined) {
  if (session === getAuthSession()) {
    clearTokens();
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  }
}

let refresh: { session: string; promise: Promise<string> } | null = null;

function refreshAccessToken(session: string, token: string) {
  if (refresh?.session === session) return refresh.promise;
  const promise = refreshClient.post<{ access: string }>("/users/token/refresh/", {
    refresh: token,
  }).then(({ data }) => {
    if (getAuthSession() !== session) {
      throw new axios.CanceledError("The account session changed.");
    }
    if (typeof data.access !== "string" || !data.access) {
      throw new Error("Invalid token refresh response.");
    }
    saveAccessToken(data.access);
    return data.access;
  }).finally(() => {
    if (refresh?.promise === promise) refresh = null;
  });
  refresh = { session, promise };
  return promise;
}

apiClient.interceptors.request.use((config: SessionRequest) => {
  if (anonymousEndpoints.has(config.url?.split("?")[0] ?? "")) {
    config.headers.delete("Authorization");
    return config;
  }
  config._authSession ??= getAuthSession();
  assertSession(config);
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  else config.headers.delete("Authorization");
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    assertSession(response.config as SessionRequest);
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as SessionRequest | undefined;
    if (original) assertSession(original);
    if (error.response?.status !== 401 || !original || original._authSession === undefined) {
      throw error;
    }
    if (original._retry) {
      expireSession(original._authSession);
      throw error;
    }
    original._retry = true;
    const token = getRefreshToken();
    if (!token) {
      expireSession(original._authSession);
      throw error;
    }
    // A late 401 may refer to an access token another request already refreshed.
    const current = getAccessToken();
    if (current && original.headers.Authorization !== `Bearer ${current}`) {
      return apiClient(original);
    }
    try {
      await refreshAccessToken(original._authSession, token);
    } catch (refreshError) {
      if (axios.isAxiosError(refreshError) && [401, 403].includes(refreshError.response?.status ?? 0)) {
        expireSession(original._authSession);
      }
      throw refreshError;
    }
    assertSession(original);
    return apiClient(original);
  },
);
