import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { getUserDashboard } from "../api/authApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { Icon, type IconName } from "../components/common/Icon";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { PageHeader } from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "short", day: "numeric" }).format(new Date(dateValue));
}

function SummaryCard({ icon, label, value, note }: { icon: IconName; label: string; value: number; note: string }) {
  return (
    <article className="dashboard-stat card-lift">
      <div className="dashboard-stat-icon"><Icon name={icon} className="h-5 w-5" /></div>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <div className="mt-4 flex items-end justify-between gap-4">
        <p className="race-number text-5xl text-slate-950 dark:text-white">{value}</p>
        <p className="pb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{note}</p>
      </div>
    </article>
  );
}

export function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const dashboardQuery = useQuery({ queryKey: ["user-dashboard"], queryFn: getUserDashboard, enabled: isAuthenticated });

  if (dashboardQuery.isLoading) return <LoadingMessage message="Loading your race hub..." />;
  if (dashboardQuery.isError) return <ErrorMessage title="Could not load dashboard" message="Something went wrong while loading your dashboard." />;

  const dashboard = dashboardQuery.data?.data;
  if (!dashboard) return <ErrorMessage title="Dashboard not found" message="The dashboard response was empty." />;

  const user = dashboard.user;
  const summary = dashboard.favorites_summary;
  const totalFavorites = summary.drivers_count + summary.teams_count + summary.races_count;

  return (
    <section>
      <PageHeader eyebrow="Personal paddock" title="Race dashboard" description="Your hand-picked Formula 1 grid, teams, and race weekends in one place." />

      <section className="dashboard-welcome">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-300">
            <span className="status-pulse" /> Personal grid synced
          </div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-400">Welcome back</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.05em] text-white sm:text-5xl">{user.full_name || user.username}</h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400">Your personal race center currently follows {totalFavorites} {totalFavorites === 1 ? "favorite" : "favorites"} across the championship.</p>
        </div>

        <div className="relative z-10 grid gap-3 sm:grid-cols-3 lg:w-[520px]">
          <div className="dashboard-profile-item"><span>Username</span><strong>{user.username}</strong></div>
          <div className="dashboard-profile-item"><span>Email</span><strong className="truncate">{user.email}</strong></div>
          <div className="dashboard-profile-item"><span>Country</span><strong>{user.profile?.country || "Not set"}</strong></div>
          <Link to="/profile" className="sm:col-span-3 flex items-center justify-between rounded-xl bg-white px-4 py-3 text-xs font-extrabold text-slate-950 transition hover:bg-red-500 hover:text-white">
            Manage profile <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="my-6 grid gap-4 md:grid-cols-3">
        <SummaryCard icon="helmet" label="Favorite drivers" value={summary.drivers_count} note="On your grid" />
        <SummaryCard icon="team" label="Favorite teams" value={summary.teams_count} note="Constructors" />
        <SummaryCard icon="flag" label="Favorite races" value={summary.races_count} note="Weekends" />
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <section className="dashboard-list-panel">
          <div className="dashboard-list-heading">
            <div><p>Grid watch</p><h2>Drivers</h2></div>
            <span>{dashboard.recent_favorite_drivers.length}</span>
          </div>
          {dashboard.recent_favorite_drivers.length === 0 ? <EmptyState message="No favorite drivers yet." /> : (
            <div className="space-y-2.5">
              {dashboard.recent_favorite_drivers.map((favorite, index) => (
                <Link key={favorite.id} to={`/drivers/${favorite.driver}`} className="dashboard-list-item group">
                  <span className="dashboard-list-rank">{String(index + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-sm text-slate-950 transition group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400">{favorite.driver_name}</strong>
                    <small className="mt-1 block truncate text-xs text-slate-500">{favorite.current_team_name ?? "No team"} · {favorite.driver_country}</small>
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-extrabold tracking-wider text-slate-600 dark:bg-white/6 dark:text-slate-300">{favorite.driver_abbreviation}</span>
                </Link>
              ))}
            </div>
          )}
          <Link to="/drivers" className="dashboard-panel-link">Browse all drivers <Icon name="arrow-right" className="h-4 w-4" /></Link>
        </section>

        <section className="dashboard-list-panel">
          <div className="dashboard-list-heading">
            <div><p>Constructor watch</p><h2>Teams</h2></div>
            <span>{dashboard.recent_favorite_teams.length}</span>
          </div>
          {dashboard.recent_favorite_teams.length === 0 ? <EmptyState message="No favorite teams yet." /> : (
            <div className="space-y-2.5">
              {dashboard.recent_favorite_teams.map((favorite, index) => (
                <Link key={favorite.id} to={`/teams/${favorite.team}`} className="dashboard-list-item group">
                  <span className="dashboard-list-rank">{String(index + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-sm text-slate-950 transition group-hover:text-red-600 dark:text-white dark:group-hover:text-red-400">{favorite.team_name}</strong>
                    <small className="mt-1 block truncate text-xs text-slate-500">{favorite.team_country}</small>
                  </span>
                  <Icon name="team" className="h-4 w-4 text-slate-400" />
                </Link>
              ))}
            </div>
          )}
          <Link to="/teams" className="dashboard-panel-link">Browse all teams <Icon name="arrow-right" className="h-4 w-4" /></Link>
        </section>

        <section className="dashboard-list-panel">
          <div className="dashboard-list-heading">
            <div><p>Weekend watch</p><h2>Races</h2></div>
            <span>{dashboard.recent_favorite_races.length}</span>
          </div>
          {dashboard.recent_favorite_races.length === 0 ? <EmptyState message="No favorite races yet." /> : (
            <div className="space-y-2.5">
              {dashboard.recent_favorite_races.map((favorite) => (
                <Link key={favorite.id} to={`/races/${favorite.race}`} className="dashboard-race-item group">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-red-500">Round {favorite.round_number} · {favorite.season_year}</p>
                    <Icon name="arrow-right" className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-red-500" />
                  </div>
                  <strong className="mt-2 block text-sm text-slate-950 dark:text-white">{favorite.race_name}</strong>
                  <small className="mt-1 block text-xs leading-5 text-slate-500">{favorite.circuit_name} · {formatDate(favorite.race_date)}</small>
                </Link>
              ))}
            </div>
          )}
          <Link to="/races" className="dashboard-panel-link">Open race calendar <Icon name="arrow-right" className="h-4 w-4" /></Link>
        </section>
      </div>
    </section>
  );
}
