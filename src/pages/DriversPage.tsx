import { useQuery } from "@tanstack/react-query";
import { getDrivers } from "../api/racingApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { PageHeader } from "../components/common/PageHeader";

export function DriversPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });

  if (isLoading) {
    return <LoadingMessage message="Loading drivers..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Could not load drivers"
        message={
          error instanceof Error
            ? error.message
            : "Something went wrong while loading drivers."
        }
      />
    );
  }

  const drivers = data?.results ?? [];

  return (
    <section>
      <PageHeader
        eyebrow="Racing"
        title="Drivers"
        description="Browse Formula 1 drivers from your Django REST API."
      />

      {drivers.length === 0 ? (
        <EmptyState message="No drivers found. Try running the backend seed command." />
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