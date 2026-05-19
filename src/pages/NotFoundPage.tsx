import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="mb-3 text-3xl font-bold">Page not found</h1>
      <p className="mb-6 text-slate-600">
        The page you are looking for does not exist.
      </p>
      <Link className="text-red-600 hover:underline" to="/">
        Go back home
      </Link>
    </section>
  );
}