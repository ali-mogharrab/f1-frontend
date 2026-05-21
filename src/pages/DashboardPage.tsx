import { useQuery } from "@tanstack/react-query";
import { getUserDashboard } from "../api/authApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { PageHeader } from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue));
}

export function DashboardPage() {
  const { isAuthenticated } = useAuth();

  const dashboardQuery = useQuery({
    queryKey: ["user-dashboard"],
    queryFn: getUserDashboard,
    enabled: isAuthenticated,
  });

  if (dashboardQuery.isLoading) {
    return <LoadingMessage message="Loading dashboard..." />;
  }

  if (dashboardQuery.isError) {
    return (
      <ErrorMessage
        title="Could not load dashboard"
        message="Something went wrong while loading your dashboard."
      />
    );
  }

  const dashboard = dashboardQuery.data?.data;

  if (!dashboard) {
    return (
      <ErrorMessage
        title="Dashboard not found"
        message="The dashboard response was empty."
      />
    );
  }

  const user = dashboard.user;
  const summary = dashboard.favorites_summary;

  return (
    <section>
      <PageHeader
        eyebrow="Account"
        title="Dashboard"
        description="View your profile, favorite drivers, teams, and races."
      />

      <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-950">
          Welcome, {user.full_name || user.username}
        </h2>

        <div className="mt-4 grid gap-4 text-sm text-slate-600 md:grid-cols-3">
          <p>
            <span className="font-semibold text-slate-900">Username:</span>{" "}
            {user.username}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Email:</span>{" "}
            {user.email}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Country:</span>{" "}
            {user.profile?.country || "Not set"}
          </p>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Favorite drivers
          </p>
          <p className="mt-2 text-4xl font-bold text-slate-950">
            {summary.drivers_count}
          </p>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Favorite teams
          </p>
          <p className="mt-2 text-4xl font-bold text-slate-950">
            {summary.teams_count}
          </p>
        </article>

        <article className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
            Favorite races
          </p>
          <p className="mt-2 text-4xl font-bold text-slate-950">
            {summary.races_count}
          </p>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-950">
            Recent favorite drivers
          </h2>

          {dashboard.recent_favorite_drivers.length === 0 ? (
            <EmptyState message="No favorite drivers yet." />
          ) : (
            <div className="space-y-3">
              {dashboard.recent_favorite_drivers.map((favorite) => (
                <article
                  key={favorite.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-slate-950">
                        {favorite.driver_name}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {favorite.driver_country}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                      {favorite.driver_abbreviation}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-600">
                    {favorite.current_team_name ?? "No team"}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-950">
            Recent favorite teams
          </h2>

          {dashboard.recent_favorite_teams.length === 0 ? (
            <EmptyState message="No favorite teams yet." />
          ) : (
            <div className="space-y-3">
              {dashboard.recent_favorite_teams.map((favorite) => (
                <article
                  key={favorite.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <h3 className="font-bold text-slate-950">
                    {favorite.team_name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {favorite.team_country}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-950">
            Recent favorite races
          </h2>

          {dashboard.recent_favorite_races.length === 0 ? (
            <EmptyState message="No favorite races yet." />
          ) : (
            <div className="space-y-3">
              {dashboard.recent_favorite_races.map((favorite) => (
                <article
                  key={favorite.id}
                  className="rounded-xl border border-slate-100 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                    Round {favorite.round_number} · {favorite.season_year}
                  </p>

                  <h3 className="mt-1 font-bold text-slate-950">
                    {favorite.race_name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {favorite.circuit_name} · {formatDate(favorite.race_date)}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}