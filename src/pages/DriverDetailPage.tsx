import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import { getDriver, getRaceResults } from "../api/racingApi";
import { getDriverStandings } from "../api/standingsApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { LoadingMessage } from "../components/common/LoadingMessage";

function formatDate(dateValue: string | null) {
  if (!dateValue) {
    return "N/A";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue));
}

export function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();

  const driverQuery = useQuery({
    queryKey: ["driver", id],
    queryFn: () => getDriver(id as string),
    enabled: Boolean(id),
  });

  const standingsQuery = useQuery({
    queryKey: ["driver-standings", "driver", id],
    queryFn: () =>
      getDriverStandings({
        driver: id as string,
        ordering: "-season__year,position",
      }),
    enabled: Boolean(id),
  });

  const raceResultsQuery = useQuery({
    queryKey: ["race-results", "driver", id],
    queryFn: () =>
      getRaceResults({
        driver: id as string,
        ordering: "-race__season__year,-race__round_number",
      }),
    enabled: Boolean(id),
  });

  if (!id) {
    return (
      <ErrorMessage
        title="Driver not found"
        message="The driver URL is missing an id."
      />
    );
  }

  if (driverQuery.isLoading) {
    return <LoadingMessage message="Loading driver..." />;
  }

  if (driverQuery.isError || !driverQuery.data) {
    return (
      <ErrorMessage
        title="Could not load driver"
        message="The driver could not be found."
      />
    );
  }

  const driver = driverQuery.data;
  const standings = standingsQuery.data?.results ?? [];
  const raceResults = raceResultsQuery.data?.results ?? [];

  return (
    <article className="space-y-6">
      <Link
        to="/drivers"
        className="back-link"
      >
        Back to drivers
      </Link>

      <section className="detail-hero surface-panel grid overflow-hidden rounded-3xl lg:grid-cols-[380px_1fr]">
        <ImageWithFallback
          src={driver.image}
          alt={driver.full_name}
          fallbackLabel={driver.abbreviation}
          className="detail-driver-image h-80 w-full object-contain object-center lg:h-full"
        />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                Driver
              </p>
              <h1 className="detail-title mt-1">
                {driver.full_name}
              </h1>
              <p className="mt-2 text-slate-600 dark:text-slate-300">
                {driver.country || "Unknown country"}
              </p>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-lg font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {driver.abbreviation}
            </span>
          </div>

          <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">
                Race number
              </dt>
              <dd className="mt-1 text-slate-600 dark:text-slate-300">
                {driver.number ?? "N/A"}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">
                Status
              </dt>
              <dd className="mt-1 capitalize text-slate-600 dark:text-slate-300">
                {driver.status}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">
                Current team
              </dt>
              <dd className="mt-1 text-slate-600 dark:text-slate-300">
                {driver.current_team && driver.current_team_name ? (
                  <Link
                    to={`/teams/${driver.current_team}`}
                    className="font-semibold text-red-600 hover:underline dark:text-red-400"
                  >
                    {driver.current_team_name}
                  </Link>
                ) : (
                  "No team"
                )}
              </dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900 dark:text-slate-100">
                Born
              </dt>
              <dd className="mt-1 text-slate-600 dark:text-slate-300">
                {formatDate(driver.date_of_birth)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="font-semibold text-slate-900 dark:text-slate-100">
                Place of birth
              </dt>
              <dd className="mt-1 text-slate-600 dark:text-slate-300">
                {driver.place_of_birth || "N/A"}
              </dd>
            </div>
          </dl>

          {driver.biography ? (
            <p className="mt-8 whitespace-pre-line leading-7 text-slate-700 dark:text-slate-300">
              {driver.biography}
            </p>
          ) : null}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="surface-panel overflow-hidden rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Championship standings
          </h2>

          {standings.length === 0 ? (
            <div className="mt-4">
              <EmptyState message="No championship standings found for this driver." />
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="py-3 pr-4 font-semibold">Season</th>
                    <th className="py-3 pr-4 font-semibold">Pos</th>
                    <th className="py-3 pr-4 font-semibold">Team</th>
                    <th className="py-3 pr-4 font-semibold">Wins</th>
                    <th className="py-3 text-right font-semibold">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((standing) => (
                    <tr
                      key={standing.id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="py-3 pr-4 font-medium text-slate-900 dark:text-slate-100">
                        {standing.season_year}
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                        {standing.position}
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                        {standing.team && standing.team_name ? (
                          <Link
                            to={`/teams/${standing.team}`}
                            className="hover:text-red-600 dark:hover:text-red-400"
                          >
                            {standing.team_name}
                          </Link>
                        ) : (
                          "No team"
                        )}
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                        {standing.wins}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-950 dark:text-white">
                        {standing.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="surface-panel overflow-hidden rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Recent race results
          </h2>

          {raceResults.length === 0 ? (
            <div className="mt-4">
              <EmptyState message="No race results found for this driver." />
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <th className="py-3 pr-4 font-semibold">Race</th>
                    <th className="py-3 pr-4 font-semibold">Team</th>
                    <th className="py-3 pr-4 font-semibold">Grid</th>
                    <th className="py-3 pr-4 font-semibold">Finish</th>
                    <th className="py-3 text-right font-semibold">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {raceResults.map((result) => (
                    <tr
                      key={result.id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="py-3 pr-4">
                        <Link
                          to={`/races/${result.race}`}
                          className="font-medium text-slate-900 hover:text-red-600 dark:text-slate-100 dark:hover:text-red-400"
                        >
                          {result.race_name}
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Round {result.round_number} · {result.season_year}
                        </p>
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                        <Link
                          to={`/teams/${result.team}`}
                          className="hover:text-red-600 dark:hover:text-red-400"
                        >
                          {result.team_name}
                        </Link>
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                        {result.grid_position ?? "N/A"}
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                        {result.classified_position || result.position}
                      </td>
                      <td className="py-3 text-right font-bold text-slate-950 dark:text-white">
                        {result.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </article>
  );
}
