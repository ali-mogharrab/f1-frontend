import { Link } from "react-router";
import { Icon } from "../common/Icon";

const footerLinks = [
  { label: "Drivers", to: "/drivers" },
  { label: "Teams", to: "/teams" },
  { label: "Race calendar", to: "/races" },
  { label: "Standings", to: "/standings" },
  { label: "Editorial", to: "/articles" },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end lg:px-8">
        <div>
          <Link to="/" className="inline-flex items-center gap-3" aria-label="Gridline home">
            <span className="brand-mark brand-mark--small" aria-hidden="true">
              <span />
              <span />
            </span>
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.22em] text-white">Gridline</span>
              <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">Formula 1 intelligence</span>
            </span>
          </Link>
          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-500">
            A complete Formula 1 data experience for exploring the grid, the calendar, championship form, and the stories behind every race.
          </p>
        </div>

        <div className="lg:text-right">
          <div className="flex flex-wrap gap-x-5 gap-y-3 lg:justify-end">
            {footerLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400 transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-600 lg:justify-end">
            <Icon name="flag" className="h-4 w-4 text-red-500" />
            <span>Built for the pursuit of speed.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
