import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "../api/racingApi";

export function DriversPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });

  if (isLoading) {
    return <p className="text-slate-600">Loading drivers...</p>;
  }

  if (isError) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-red-700">
        <h1 className="mb-2 text-xl font-bold">Could not load drivers</h1>
        <p>
          {error instanceof Error
            ? error.message
            : "Something went wrong while loading drivers."}
        </p>
      </div>
    );
  }

  const drivers = data?.results ?? [];

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Racing
        </p>
        <h1 className="text-3xl font-bold text-slate-950">Drivers</h1>
        <p className="mt-2 text-slate-600">
          Browse Formula 1 drivers from your Django REST API.
        </p>
      </div>

      {drivers.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-slate-600">
            No drivers found. Try running the backend seed command.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => (
            <article
              key={driver.id}
              className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">
                    {driver.full_name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {driver.country || "Unknown country"}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                  {driver.abbreviation}
                </span>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Number:</span>{" "}
                  {driver.number ?? "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Team:</span>{" "}
                  {driver.current_team_name ?? "No team"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Status:</span>{" "}
                  {driver.status}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}