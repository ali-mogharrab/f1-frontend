const ACCESS_TOKEN_KEY = "f1_access_token";
const REFRESH_TOKEN_KEY = "f1_refresh_token";
let sessionVersion = 0;

export const SESSION_EXPIRED_EVENT = "f1:session-expired";

// Changes on login/logout, but remains stable during access-token refresh.
export function getAuthSession() {
  return `${sessionVersion}:${getRefreshToken() ?? ""}`;
}

export function saveTokens(access: string, refresh: string) {
  sessionVersion++;
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function saveAccessToken(access: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens() {
  sessionVersion++;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
