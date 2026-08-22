import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { getDrivers, getRaceResults, getTeam } from "../api/racingApi";
import { getConstructorStandings } from "../api/standingsApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { LoadingMessage } from "../components/common/LoadingMessage";

export function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();

  const teamQuery = useQuery({
    queryKey: ["team", id],
    queryFn: () => getTeam(id as string),
    enabled: Boolean(id),
  });

  const driversQuery = useQuery({
    queryKey: ["drivers", "team", id],
    queryFn: () =>
      getDrivers({
        current_team: id as string,
        ordering: "last_name,first_name",
      }),
    enabled: Boolean(id),
  });

  const standingsQuery = useQuery({
    queryKey: ["constructor-standings", "team", id],
    queryFn: () =>
      getConstructorStandings({
        team: id as string,
        ordering: "-season__year,position",
      }),
    enabled: Boolean(id),
  });

  const raceResultsQuery = useQuery({
    queryKey: ["race-results", "team", id],
    queryFn: () =>
      getRaceResults({
        team: id as string,
        ordering: "-race__season__year,-race__round_number,position",
      }),
    enabled: Boolean(id),
  });

  if (!id) {
    return (
      <ErrorMessage
        title="Team not found"
        message="The team URL is missing an id."
      />
    );
  }

  if (teamQuery.isLoading) {
    return <LoadingMessage message="Loading team..." />;
  }

  if (teamQuery.isError || !teamQuery.data) {
    return (
      <ErrorMessage
        title="Could not load team"
        message="The team could not be found."
      />
    );
  }

  const team = teamQuery.data;
  const drivers = driversQuery.data?.results ?? [];
  const standings = standingsQuery.data?.results ?? [];
  const raceResults = raceResultsQuery.data?.results ?? [];

  return (
    <article className="space-y-6">
      <Link
        to="/teams"
        className="back-link"
      >
        Back to teams
      </Link>

      <section className="detail-hero surface-panel rounded-3xl p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="flex min-h-44 items-center justify-center rounded-2xl bg-slate-50 p-6 dark:bg-slate-800">
            <ImageWithFallback
              src={team.logo}
              alt={team.name}
              fallbackLabel={team.name}
              className="max-h-32 w-full object-contain"
            />
          </div>

          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                  Team
                </p>
                <h1 className="detail-title mt-1">
                  {team.name}
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  {team.official_name || "No official name"}
                </p>
              </div>

              <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-bold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {team.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">
                  Country
                </dt>
                <dd className="mt-1 text-slate-600 dark:text-slate-300">
                  {team.country || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">
                  Base
                </dt>
                <dd className="mt-1 text-slate-600 dark:text-slate-300">
                  {team.base_location || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">
                  Team principal
                </dt>
                <dd className="mt-1 text-slate-600 dark:text-slate-300">
                  {team.team_principal || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">
                  Technical chief
                </dt>
                <dd className="mt-1 text-slate-600 dark:text-slate-300">
                  {team.technical_chief || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">
                  Chassis
                </dt>
                <dd className="mt-1 text-slate-600 dark:text-slate-300">
                  {team.chassis || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">
                  Power unit
                </dt>
                <dd className="mt-1 text-slate-600 dark:text-slate-300">
                  {team.power_unit || "N/A"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">
                  First entry
                </dt>
                <dd className="mt-1 text-slate-600 dark:text-slate-300">
                  {team.first_team_entry ?? "N/A"}
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900 dark:text-slate-100">
                  World championships
                </dt>
                <dd className="mt-1 text-slate-600 dark:text-slate-300">
                  {team.world_championships}
                </dd>
              </div>
            </dl>

            {team.website ? (
              <a
                href={team.website}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block text-sm font-semibold text-red-600 hover:underline dark:text-red-400"
              >
                Visit official website
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="surface-panel rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Current drivers
          </h2>

          {drivers.length === 0 ? (
            <div className="mt-4">
              <EmptyState message="No current drivers found for this team." />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {drivers.map((driver) => (
                <Link
                  key={driver.id}
                  to={`/drivers/${driver.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-red-200 hover:bg-red-50/40 dark:border-slate-800 dark:hover:border-red-900 dark:hover:bg-red-950/20"
                >
                  <div>
                    <h3 className="font-bold text-slate-950 dark:text-white">
                      {driver.full_name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {driver.country}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {driver.abbreviation}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="surface-panel rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Constructor seasons
          </h2>

          {standings.length === 0 ? (
            <div className="mt-4">
              <EmptyState message="No constructor standings found for this team." />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {standings.map((standing) => (
                <div
                  key={standing.id}
                  className="rounded-xl border border-slate-100 p-4 dark:border-slate-800"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                        {standing.season_year}
                      </p>
                      <h3 className="mt-1 font-bold text-slate-950 dark:text-white">
                        Position {standing.position}
                      </h3>
                    </div>
                    <span className="font-bold text-slate-950 dark:text-white">
                      {standing.points} pts
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {standing.wins} wins · {standing.podiums} podiums
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="surface-panel rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Recent race results
          </h2>

          {raceResults.length === 0 ? (
            <div className="mt-4">
              <EmptyState message="No race results found for this team." />
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {raceResults.slice(0, 8).map((result) => (
                <div
                  key={result.id}
                  className="rounded-xl border border-slate-100 p-4 dark:border-slate-800"
                >
                  <Link
                    to={`/races/${result.race}`}
                    className="font-bold text-slate-950 hover:text-red-600 dark:text-white dark:hover:text-red-400"
                  >
                    {result.race_name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {result.driver_name} · P
                    {result.classified_position || result.position} ·{" "}
                    {result.points} pts
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
