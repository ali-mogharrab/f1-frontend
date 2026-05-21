import { useQuery } from "@tanstack/react-query";
import {
  getConstructorStandings,
  getDriverStandings,
} from "../api/standingsApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { PageHeader } from "../components/common/PageHeader";

export function StandingsPage() {
  const driverStandingsQuery = useQuery({
    queryKey: ["driver-standings"],
    queryFn: getDriverStandings,
  });

  const constructorStandingsQuery = useQuery({
    queryKey: ["constructor-standings"],
    queryFn: getConstructorStandings,
  });

  const isLoading =
    driverStandingsQuery.isLoading || constructorStandingsQuery.isLoading;

  const isError =
    driverStandingsQuery.isError || constructorStandingsQuery.isError;

  if (isLoading) {
    return <LoadingMessage message="Loading standings..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Could not load standings"
        message="Something went wrong while loading championship standings."
      />
    );
  }

  const driverStandings = driverStandingsQuery.data?.results ?? [];
  const constructorStandings = constructorStandingsQuery.data?.results ?? [];

  return (
    <section>
      <PageHeader
        eyebrow="Championship"
        title="Standings"
        description="View Formula 1 driver and constructor championship standings."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              Driver standings
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Championship ranking by driver.
            </p>
          </div>

          {driverStandings.length === 0 ? (
            <EmptyState message="No driver standings found. Try running the backend seed command or adding standings in admin." />
          ) : (
            <div className="-mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 pr-4 font-semibold">Pos</th>
                    <th className="py-3 pr-4 font-semibold">Driver</th>
                    <th className="py-3 pr-4 font-semibold">Team</th>
                    <th className="py-3 pr-4 font-semibold">Wins</th>
                    <th className="py-3 pr-4 text-right font-semibold">
                      Points
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {driverStandings.map((standing) => (
                    <tr
                      key={standing.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-4 pr-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                          {standing.position}
                        </span>
                      </td>

                      <td className="py-4 pr-4">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {standing.driver_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {standing.driver_abbreviation} ·{" "}
                            {standing.driver_country}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-slate-600">
                        {standing.team_name ?? "No team"}
                      </td>

                      <td className="py-4 pr-4 text-slate-600">
                        {standing.wins}
                      </td>

                      <td className="py-4 pl-4 text-right font-bold text-slate-950">
                        {standing.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-slate-950">
              Constructor standings
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Championship ranking by team.
            </p>
          </div>

          {constructorStandings.length === 0 ? (
            <EmptyState message="No constructor standings found. Try running the backend seed command or adding standings in admin." />
          ) : (
            <div className="-mx-2 overflow-x-auto px-2">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 pr-4 font-semibold">Pos</th>
                    <th className="py-3 pr-4 font-semibold">Team</th>
                    <th className="py-3 pr-4 font-semibold">Wins</th>
                    <th className="py-3 pr-4 font-semibold">Podiums</th>
                    <th className="py-3 pr-4 text-right font-semibold">
                      Points
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {constructorStandings.map((standing) => (
                    <tr
                      key={standing.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="py-4 pr-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                          {standing.position}
                        </span>
                      </td>

                      <td className="py-4 pr-4">
                        <div>
                          <p className="font-semibold text-slate-950">
                            {standing.team_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {standing.team_country}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 pr-4 text-slate-600">
                        {standing.wins}
                      </td>

                      <td className="py-4 pr-4 text-slate-600">
                        {standing.podiums}
                      </td>

                      <td className="py-4 pl-4 text-right font-bold text-slate-950">
                        {standing.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </section>
  );
}