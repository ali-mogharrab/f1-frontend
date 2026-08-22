import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "arrow-right"
  | "calendar"
  | "close"
  | "dashboard"
  | "flag"
  | "heart"
  | "helmet"
  | "home"
  | "lock"
  | "menu"
  | "moon"
  | "newspaper"
  | "search"
  | "sun"
  | "team"
  | "trophy"
  | "user";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
};

const paths: Record<IconName, ReactNode> = {
  "arrow-right": <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  calendar: <><path d="M7 3v3M17 3v3" /><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /></>,
  close: <><path d="m6 6 12 12M18 6 6 18" /></>,
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  flag: <><path d="M5 21V4" /><path d="M5 5c5-3 9 3 14 0v9c-5 3-9-3-14 0" /></>,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
  helmet: <><path d="M4 13a8 8 0 0 1 16 0v3H9a5 5 0 0 1-5-5Z" /><path d="M12 5v8h8M9 16v3h8l3-3" /></>,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />,
  newspaper: <><path d="M4 4h16v16H4z" /><path d="M8 8h8M8 12h8M8 16h5" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  team: <><circle cx="8" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M2.5 20a5.5 5.5 0 0 1 11 0M13 16a4.5 4.5 0 0 1 8.5 2" /></>,
  trophy: <><path d="M8 4h8v5a4 4 0 0 1-8 0Z" /><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
};

export function Icon({ name, className = "", ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
