export function getMediaUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiBaseUrl = new URL(import.meta.env.VITE_API_BASE_URL || "/api", window.location.origin);
  const url = new URL(path, `${apiBaseUrl.origin}/`);
  return ["http:", "https:"].includes(url.protocol) ? url.href : null;
}
