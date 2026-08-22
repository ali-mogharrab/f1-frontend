import { Link } from "react-router";
import { Icon } from "../components/common/Icon";

export function NotFoundPage() {
  return (
    <section className="race-detail-hero mx-auto max-w-4xl rounded-3xl px-6 py-16 text-center sm:px-10 sm:py-24">
      <p className="race-number text-8xl text-white/10 sm:text-9xl">404</p>
      <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-red-400">Outside track limits</p>
      <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">This page missed the apex.</h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-slate-400">The route you requested does not exist or has moved somewhere else on the grid.</p>
      <Link className="action-button mt-8 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold text-white" to="/">
        Return to race control <Icon name="arrow-right" className="h-4 w-4" />
      </Link>
    </section>
  );
}
