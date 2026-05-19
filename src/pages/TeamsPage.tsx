import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../api/racingApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { PageHeader } from "../components/common/PageHeader";

export function TeamsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  if (isLoading) {
    return <LoadingMessage message="Loading teams..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Could not load teams"
        message={
          error instanceof Error
            ? error.message
            : "Something went wrong while loading teams."
        }
      />
    );
  }

  const teams = data?.results ?? [];

  return (
    <section>
      <PageHeader
        eyebrow="Racing"
        title="Teams"
        description="Browse Formula 1 teams from your Django REST API."
      />

      {teams.length === 0 ? (
        <EmptyState message="No teams found. Try running the backend seed command." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <article
              key={team.id}
              className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-950">
                  {team.name}
                </h2>
                <p className="text-sm text-slate-500">
                  {team.official_name || "No official name"}
                </p>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Country:</span>{" "}
                  {team.country || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Base:</span>{" "}
                  {team.base_location || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Power unit:
                  </span>{" "}
                  {team.power_unit || "N/A"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">
                    Championships:
                  </span>{" "}
                  {team.world_championships}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}