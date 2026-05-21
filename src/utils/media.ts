export function getMediaUrl(path: string | null | undefined) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const backendBaseUrl = apiBaseUrl.replace("/api", "");

  return `${backendBaseUrl}${path}`;
}