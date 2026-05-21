import { useQueryClient } from "@tanstack/react-query";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Drivers", to: "/drivers" },
  { label: "Teams", to: "/teams" },
  { label: "Races", to: "/races" },
  { label: "Standings", to: "/standings" },
  { label: "Articles", to: "/articles" },
];

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const queryClient = useQueryClient();
  
  function handleLogout() {
    logout();
    queryClient.clear();
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-bold text-red-600">
          F1 Hub
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                isActive
                  ? "text-red-600"
                  : "text-slate-700 hover:text-red-600"
              }
            >
              {link.label}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "text-red-600" : "text-slate-700 hover:text-red-600"
                }
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  isActive ? "text-red-600" : "text-slate-700 hover:text-red-600"
                }
              >
                {user?.username}
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
            <div className="flex items-center gap-2">
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  isActive ? "text-red-600" : "text-slate-700 hover:text-red-600"
                }
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
      </nav>
    </header>
  );
}