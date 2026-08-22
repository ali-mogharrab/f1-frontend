import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Icon, type IconName } from "../common/Icon";
import { ThemeToggle } from "../common/ThemeToggle";

const navLinks: { label: string; to: string; icon: IconName }[] = [
  { label: "Home", to: "/", icon: "home" },
  { label: "Drivers", to: "/drivers", icon: "helmet" },
  { label: "Teams", to: "/teams", icon: "team" },
  { label: "Races", to: "/races", icon: "flag" },
  { label: "Standings", to: "/standings", icon: "trophy" },
  { label: "Articles", to: "/articles", icon: "newspaper" },
];

function desktopLinkClass(isActive: boolean) {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

function mobileLinkClass(isActive: boolean) {
  return isActive ? "mobile-nav-link mobile-nav-link--active" : "mobile-nav-link";
}

export function Navbar() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    queryClient.clear();
    setIsMenuOpen(false);
  }

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="site-header sticky top-0 z-50 text-white">
      <div className="telemetry-strip hidden sm:block">
        <div className="mx-auto flex h-7 max-w-7xl items-center justify-between px-6 text-[9px] font-bold uppercase tracking-[0.18em] lg:px-8">
          <div className="flex items-center gap-3">
            <span className="status-pulse" />
            <span>Data systems online</span>
          </div>
          <div className="flex items-center gap-5">
            <span>The paddock / Formula 1 intelligence</span>
            <span className="text-slate-600">Season hub</span>
          </div>
        </div>
      </div>

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
        <div className="flex h-[68px] items-center justify-between gap-4">
          <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-3" aria-label="Gridline home">
            <span className="brand-mark" aria-hidden="true"><span /><span /></span>
            <span>
              <span className="block text-sm font-black uppercase leading-none tracking-[0.2em]">Gridline</span>
              <span className="mt-1 block text-[8px] font-bold uppercase leading-none tracking-[0.19em] text-slate-500">F1 intelligence</span>
            </span>
          </Link>

          <div className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={({ isActive }) => desktopLinkClass(isActive)}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="hidden items-center gap-2 sm:flex">
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => `${isActive ? "border-red-500/60 bg-red-500/10 text-white" : "border-white/10 bg-white/[0.045] text-slate-300 hover:border-white/20 hover:text-white"} inline-flex h-10 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition`}
                  title="Dashboard"
                >
                  <Icon name="dashboard" className="h-4 w-4" />
                  <span className="hidden xl:inline">Dashboard</span>
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) => `${isActive ? "border-red-500/60 bg-red-500/10" : "border-white/10 bg-white/[0.045] hover:border-white/20"} inline-flex h-10 items-center gap-2 rounded-xl border px-2.5 text-xs font-bold text-white transition`}
                  title="Profile"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-red-500 text-[10px] font-black uppercase">
                    {user?.username?.slice(0, 1) || "U"}
                  </span>
                  <span className="hidden max-w-24 truncate xl:inline">{user?.username}</span>
                </NavLink>
                <NavLink to="/change-password" className="icon-button" title="Security" aria-label="Security settings">
                  <Icon name="lock" className="h-4 w-4" />
                </NavLink>
                <button type="button" onClick={handleLogout} className="h-10 rounded-xl bg-white px-3.5 text-xs font-extrabold text-slate-950 transition hover:bg-red-500 hover:text-white">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <NavLink to="/register" className="rounded-xl px-3 py-2 text-xs font-bold text-slate-300 transition hover:text-white">
                  Register
                </NavLink>
                <NavLink to="/login" className="rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-slate-950 transition hover:bg-red-500 hover:text-white">
                  Login
                </NavLink>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen((current) => !current)}
              className="icon-button lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
            >
              <Icon name={isMenuOpen ? "close" : "menu"} className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-white/8 pb-5 pt-4 lg:hidden">
            <div className="grid gap-1 sm:grid-cols-2">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={closeMenu} className={({ isActive }) => mobileLinkClass(isActive)}>
                  <Icon name={link.icon} className="h-[18px] w-[18px] text-red-400" />
                  {link.label}
                </NavLink>
              ))}
            </div>

            <div className="mt-4 border-t border-white/8 pt-4 sm:hidden">
              {isAuthenticated ? (
                <div className="grid gap-1">
                  <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => mobileLinkClass(isActive)}>
                    <Icon name="dashboard" className="h-[18px] w-[18px] text-red-400" /> Dashboard
                  </NavLink>
                  <NavLink to="/profile" onClick={closeMenu} className={({ isActive }) => mobileLinkClass(isActive)}>
                    <Icon name="user" className="h-[18px] w-[18px] text-red-400" /> Profile · {user?.username}
                  </NavLink>
                  <NavLink to="/change-password" onClick={closeMenu} className={({ isActive }) => mobileLinkClass(isActive)}>
                    <Icon name="lock" className="h-[18px] w-[18px] text-red-400" /> Security
                  </NavLink>
                  <button type="button" onClick={handleLogout} className="mt-2 rounded-xl bg-white px-4 py-3 text-left text-sm font-extrabold text-slate-950">Logout</button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <NavLink to="/register" onClick={closeMenu} className="rounded-xl border border-white/10 px-4 py-3 text-center text-sm font-bold text-slate-200">Register</NavLink>
                  <NavLink to="/login" onClick={closeMenu} className="rounded-xl bg-white px-4 py-3 text-center text-sm font-extrabold text-slate-950">Login</NavLink>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
