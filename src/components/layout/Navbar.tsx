import { Link, NavLink } from "react-router-dom";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Drivers", to: "/drivers" },
  { label: "Teams", to: "/teams" },
  { label: "Races", to: "/races" },
  { label: "Standings", to: "/standings" },
  { label: "Articles", to: "/articles" },
];

export function Navbar() {
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
      </nav>
    </header>
  );
}