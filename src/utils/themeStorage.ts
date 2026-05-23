export type Theme = "light" | "dark";

const THEME_KEY = "f1_theme";

export function getStoredTheme(): Theme | null {
  const storedTheme = localStorage.getItem(THEME_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return null;
}

export function saveTheme(theme: Theme) {
  localStorage.setItem(THEME_KEY, theme);
}

export function getPreferredTheme(): Theme {
  const storedTheme = getStoredTheme();

  if (storedTheme) {
    return storedTheme;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}
