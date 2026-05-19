export function HomePage() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow-sm">
      <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-600">
        Formula 1 API Project
      </p>

      <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-950">
        Follow Formula 1 data, standings, races, and articles.
      </h1>

      <p className="max-w-2xl text-lg text-slate-600">
        This React frontend will connect to your Django REST Framework backend.
        We will build it step by step while learning React basics.
      </p>
    </section>
  );
}