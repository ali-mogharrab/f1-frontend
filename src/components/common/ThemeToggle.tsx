import { useTheme } from "../../context/ThemeContext";
import { Icon } from "./Icon";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="icon-button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <Icon name={isDark ? "sun" : "moon"} className="h-[18px] w-[18px]" />
    </button>
  );
}
