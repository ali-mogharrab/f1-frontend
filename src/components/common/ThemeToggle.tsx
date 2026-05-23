import { useTheme } from "../../context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      aria-label="Toggle dark mode"
    >
      {isDark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
