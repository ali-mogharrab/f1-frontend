import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router";
import {
  getCircuit,
  getQualifyingResults,
  getRace,
  getRaceResults,
  getSprintResults,
} from "../api/racingApi";
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

function formatTime(timeValue: string | null) {
  if (!timeValue) {
    return "N/A";
  }

  return timeValue.slice(0, 5);
}

export function RaceDetailPage() {
  const { id } = useParams<{ id: string }>();

  const raceQuery = useQuery({
    queryKey: ["race", id],
    queryFn: () => getRace(id as string),
    enabled: Boolean(id),
  });

  const circuitId = raceQuery.data?.circuit;

  const circuitQuery = useQuery({
    queryKey: ["circuit", circuitId],
    queryFn: () => getCircuit(circuitId as string),
    enabled: Boolean(circuitId),
  });

  const raceResultsQuery = useQuery({
    queryKey: ["race-results", "race", id],
    queryFn: () =>
      getRaceResults({
        race: id as string,
        ordering: "position",
      }),
    enabled: Boolean(id),
  });

  const qualifyingResultsQuery = useQuery({
    queryKey: ["qualifying-results", "race", id],
    queryFn: () =>
      getQualifyingResults({
        race: id as string,
        ordering: "position",
      }),
    enabled: Boolean(id),
  });

  const sprintResultsQuery = useQuery({
    queryKey: ["sprint-results", "race", id],
    queryFn: () =>
      getSprintResults({
        race: id as string,
        ordering: "position",
      }),
    enabled: Boolean(id),
  });

  if (!id) {
    return (
      <ErrorMessage
        title="Race not found"
        message="The race URL is missing an id."
      />
    );
  }

  if (raceQuery.isLoading) {
    return <LoadingMessage message="Loading race..." />;
  }

  if (raceQuery.isError || !raceQuery.data) {
    return (
      <ErrorMessage
        title="Could not load race"
        message="The race could not be found."
      />
    );
  }

  const race = raceQuery.data;
  const circuit = circuitQuery.data;
  const raceResults = raceResultsQuery.data?.results ?? [];
  const qualifyingResults = qualifyingResultsQuery.data?.results ?? [];
  const sprintResults = sprintResultsQuery.data?.results ?? [];

  return (
    <article className="space-y-6">
      <Link
        to="/races"
        className="back-link"
      >
        Back to races
      </Link>

      <section className="race-detail-hero rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
              Round {race.round_number} · {race.season_year}
            </p>
            <h1 className="detail-title mt-2 !text-white">
              {race.name}
            </h1>
            <p className="mt-2 text-slate-400">
              {race.official_name || "No official name"}
            </p>
          </div>

          <span className="w-fit rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-200">
            {race.status}
          </span>
        </div>

        <dl className="mt-8 grid gap-3 text-sm md:grid-cols-3">
          <div className="race-session-card">
            <dt className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-red-400">
              Race
            </dt>
            <dd className="mt-2 text-slate-300">
              {formatDate(race.race_date)} · {formatTime(race.race_time)}
            </dd>
          </div>
          <div className="race-session-card">
            <dt className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-red-400">
              Qualifying
            </dt>
            <dd className="mt-2 text-slate-300">
              {formatDate(race.qualifying_date)} ·{" "}
              {formatTime(race.qualifying_time)}
            </dd>
          </div>
          <div className="race-session-card">
            <dt className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-red-400">
              Sprint
            </dt>
            <dd className="mt-2 text-slate-300">
              {formatDate(race.sprint_date)} · {formatTime(race.sprint_time)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="surface-panel overflow-hidden rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Race results
          </h2>

          {raceResults.length === 0 ? (
            <div className="mt-4">
              <EmptyState message="No race results found for this race." />
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                    <th className="py-3 pr-4 font-semibold">Pos</th>
                    <th className="py-3 pr-4 font-semibold">Driver</th>
                    <th className="py-3 pr-4 font-semibold">Team</th>
                    <th className="py-3 pr-4 font-semibold">Grid</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 text-right font-semibold">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {raceResults.map((result) => (
                    <tr
                      key={result.id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="py-3 pr-4 font-bold text-slate-950 dark:text-white">
                        {result.classified_position || result.position}
                      </td>
                      <td className="py-3 pr-4">
                        <Link
                          to={`/drivers/${result.driver}`}
                          className="font-semibold text-slate-950 hover:text-red-600 dark:text-white dark:hover:text-red-400"
                        >
                          {result.driver_name}
                        </Link>
                        <p className="text-xs text-slate-500">
                          {result.driver_abbreviation}
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
                      <td className="py-3 pr-4 capitalize text-slate-600 dark:text-slate-300">
                        {result.status.replaceAll("_", " ")}
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

        <aside className="space-y-6">
          <div className="surface-panel overflow-hidden rounded-3xl">
            <ImageWithFallback
              src={circuit?.image}
              alt={race.circuit_name}
              fallbackLabel={race.circuit_name}
              className="h-44 w-full object-cover"
            />

            <div className="p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                Circuit
              </p>
              <h2 className="mt-1 text-xl font-bold text-slate-950 dark:text-white">
                {race.circuit_name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {circuit?.city ? `${circuit.city}, ` : ""}
                {race.circuit_country}
              </p>

              {circuit ? (
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="font-semibold text-slate-900 dark:text-slate-100">
                      Length
                    </dt>
                    <dd className="text-slate-600 dark:text-slate-300">
                      {circuit.length_km ?? "N/A"} km
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900 dark:text-slate-100">
                      Laps
                    </dt>
                    <dd className="text-slate-600 dark:text-slate-300">
                      {circuit.number_of_laps ?? "N/A"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-slate-900 dark:text-slate-100">
                      Race distance
                    </dt>
                    <dd className="text-slate-600 dark:text-slate-300">
                      {circuit.race_distance_km ?? "N/A"} km
                    </dd>
                  </div>
                </dl>
              ) : null}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="surface-panel overflow-hidden rounded-3xl p-5 sm:p-6">
          <h2 className="text-xl font-bold text-slate-950 dark:text-white">
            Qualifying
          </h2>

          {qualifyingResults.length === 0 ? (
            <div className="mt-4">
              <EmptyState message="No qualifying results found for this race." />
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                    <th className="py-3 pr-4 font-semibold">Pos</th>
                    <th className="py-3 pr-4 font-semibold">Driver</th>
                    <th className="py-3 pr-4 font-semibold">Team</th>
                    <th className="py-3 pr-4 font-semibold">Q1</th>
                    <th className="py-3 pr-4 font-semibold">Q2</th>
                    <th className="py-3 font-semibold">Q3</th>
                  </tr>
                </thead>
                <tbody>
                  {qualifyingResults.map((result) => (
                    <tr
                      key={result.id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="py-3 pr-4 font-bold text-slate-950 dark:text-white">
                        {result.position}
                      </td>
                      <td className="py-3 pr-4">
                        <Link
                          to={`/drivers/${result.driver}`}
                          className="font-semibold text-slate-950 hover:text-red-600 dark:text-white dark:hover:text-red-400"
                        >
                          {result.driver_name}
                        </Link>
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
                        {result.q1_time || "N/A"}
                      </td>
                      <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                        {result.q2_time || "N/A"}
                      </td>
                      <td className="py-3 text-slate-600 dark:text-slate-300">
                        {result.q3_time || "N/A"}
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
            Sprint
          </h2>

          {sprintResults.length === 0 ? (
            <div className="mt-4">
              <EmptyState message="No sprint results found for this race." />
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-800">
                    <th className="py-3 pr-4 font-semibold">Pos</th>
                    <th className="py-3 pr-4 font-semibold">Driver</th>
                    <th className="py-3 pr-4 font-semibold">Team</th>
                    <th className="py-3 pr-4 font-semibold">Grid</th>
                    <th className="py-3 text-right font-semibold">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {sprintResults.map((result) => (
                    <tr
                      key={result.id}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                    >
                      <td className="py-3 pr-4 font-bold text-slate-950 dark:text-white">
                        {result.position}
                      </td>
                      <td className="py-3 pr-4">
                        <Link
                          to={`/drivers/${result.driver}`}
                          className="font-semibold text-slate-950 hover:text-red-600 dark:text-white dark:hover:text-red-400"
                        >
                          {result.driver_name}
                        </Link>
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
