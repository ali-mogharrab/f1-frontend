import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { ThemeToggle } from "../common/ThemeToggle";


const navLinks = [
  { label: "Home", to: "/" },
  { label: "Drivers", to: "/drivers" },
  { label: "Teams", to: "/teams" },
  { label: "Races", to: "/races" },
  { label: "Standings", to: "/standings" },
  { label: "Articles", to: "/articles" },
];

function getNavLinkClass(isActive: boolean) {
  return isActive
    ? "text-red-600 dark:text-red-400"
    : "text-slate-700 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400";
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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <nav className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-4">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-xl font-bold text-red-600 dark:text-red-400"
          >
            Formula 1
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? "Close" : "Menu"}
          </button>

          <div className="hidden items-center gap-4 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => getNavLinkClass(isActive)}
              >
                {link.label}
              </NavLink>
            ))}

            <ThemeToggle />

            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  {user?.username}
                </NavLink>

                <NavLink
                  to="/change-password"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Security
                </NavLink>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/register"
                  className={({ isActive }) => getNavLinkClass(isActive)}
                >
                  Register
                </NavLink>

                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-lg bg-red-600 px-3 py-2 text-white"
                      : "rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-red-600"
                  }
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>
        </div>

        {isMenuOpen ? (
          <div className="border-t border-slate-100 py-4 md:hidden dark:border-slate-800">
            <div className="mb-3 px-3">
              <ThemeToggle />
            </div>

            <div className="flex flex-col gap-3 text-sm font-medium">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive
                      ? "rounded-lg bg-red-50 px-3 py-2 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                      : "rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <div className="mt-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-3">
                    <NavLink
                      to="/dashboard"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "rounded-lg bg-red-50 px-3 py-2 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                          : "rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                      }
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/profile"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "rounded-lg bg-red-50 px-3 py-2 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                          : "rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                      }
                    >
                      Profile: {user?.username}
                    </NavLink>

                    <NavLink
                      to="/change-password"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "rounded-lg bg-red-50 px-3 py-2 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                          : "rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                      }
                    >
                      Security
                    </NavLink>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="rounded-lg bg-slate-900 px-3 py-2 text-left text-white hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <NavLink
                      to="/register"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "rounded-lg bg-red-50 px-3 py-2 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                          : "rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-red-400"
                      }
                    >
                      Register
                    </NavLink>

                    <NavLink
                      to="/login"
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive
                          ? "rounded-lg bg-red-600 px-3 py-2 text-white"
                          : "rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-red-600"
                      }
                    >
                      Login
                    </NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
