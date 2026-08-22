import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { getCurrentSeason, getLatestRace, getUpcomingRace } from "../api/racingApi";
import { getFeaturedArticles } from "../api/contentApi";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { Icon } from "../components/common/Icon";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { LoadingMessage } from "../components/common/LoadingMessage";

function formatDate(dateValue: string | null) {
  if (!dateValue) return "Date not available";
  return new Intl.DateTimeFormat("en", { year: "numeric", month: "long", day: "numeric" }).format(new Date(dateValue));
}

function formatShortDate(dateValue: string | null) {
  if (!dateValue) return "TBC";
  return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit" }).format(new Date(dateValue));
}

export function HomePage() {
  const currentSeasonQuery = useQuery({ queryKey: ["current-season"], queryFn: getCurrentSeason });
  const upcomingRaceQuery = useQuery({ queryKey: ["upcoming-race"], queryFn: getUpcomingRace });
  const latestRaceQuery = useQuery({ queryKey: ["latest-race"], queryFn: getLatestRace, retry: false });
  const featuredArticlesQuery = useQuery({ queryKey: ["featured-articles"], queryFn: () => getFeaturedArticles() });

  const isLoading = currentSeasonQuery.isLoading || upcomingRaceQuery.isLoading || featuredArticlesQuery.isLoading;
  const hasImportantError = currentSeasonQuery.isError || upcomingRaceQuery.isError || featuredArticlesQuery.isError;

  if (isLoading) return <LoadingMessage message="Loading race intelligence..." />;

  if (hasImportantError) {
    return <ErrorMessage title="Could not load home page" message="Refresh again" />;
  }

  const currentSeason = currentSeasonQuery.data;
  const upcomingRace = upcomingRaceQuery.data;
  const latestRace = latestRaceQuery.data;
  const featuredArticles = featuredArticlesQuery.data?.results ?? [];

  return (
    <div className="space-y-11 lg:space-y-14">
      <section className="home-hero">
        <div className="hero-speed-lines" aria-hidden="true"><span /><span /><span /></div>
        <div className="relative z-10 grid lg:h-[470px] lg:grid-cols-[1.18fr_0.82fr]">
          <div className="flex flex-col justify-center p-7 sm:p-9 lg:px-11 lg:py-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="hero-live-badge"><span className="status-pulse" /> Live season data</span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 sm:inline">Updated from race control</span>
            </div>

            <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.28em] text-red-500">Formula 1 / Reimagined</p>
            <h1 className="hero-title">
              Every lap.<br />Every rival.<span>One command center.</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
              Go beyond the chequered flag with deep profiles, race results, championship standings, and paddock stories in one precision-built experience.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link to="/standings" className="action-button inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-extrabold text-white">
                Explore the championship <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
              <Link to="/races" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[0.055] px-5 py-3 text-sm font-bold text-white transition hover:border-white/25 hover:bg-white/[0.09]">
                <Icon name="calendar" className="h-4 w-4 text-red-400" /> Race calendar
              </Link>
            </div>

            <div className="mt-3 grid max-w-xl grid-cols-3 border-t border-white/8 pt-3 lg:-translate-y-2">
              <div>
                <p className="hero-stat-value">{currentSeason?.year ?? "—"}</p>
                <p className="hero-stat-label">Season</p>
              </div>
              <div className="border-l border-white/8 pl-5 sm:pl-7">
                <p className="hero-stat-value">{upcomingRace ? `R${upcomingRace.round_number}` : "TBC"}</p>
                <p className="hero-stat-label">Next round</p>
              </div>
              <div className="border-l border-white/8 pl-5 sm:pl-7">
                <p className="hero-stat-value">{featuredArticles.length.toString().padStart(2, "0")}</p>
                <p className="hero-stat-label">Top stories</p>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center border-t border-white/8 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-7">
            <div className="race-orbit" aria-hidden="true"><span /><span /><span /></div>
            <div className="race-command-card">
              <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-slate-500">Race control</p>
                  <p className="mt-1 text-xs font-bold text-white">Next on the calendar</p>
                </div>
                <div className="start-lights" aria-label="Race status scheduled">
                  <span /><span /><span /><span /><span />
                </div>
              </div>

              {upcomingRace ? (
                <>
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <span className="rounded-lg bg-red-500/12 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.18em] text-red-400">Round {upcomingRace.round_number}</span>
                    <span className="race-number text-3xl text-white/10">{String(upcomingRace.round_number).padStart(2, "0")}</span>
                  </div>
                  <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.045em] text-white sm:text-3xl">{upcomingRace.name}</h2>
                  <p className="mt-2 text-xs leading-5 text-slate-400">{upcomingRace.circuit_name}<span className="mx-2 text-slate-700">/</span>{upcomingRace.circuit_country}</p>

                  <div className="mt-5 grid grid-cols-[auto_1fr] items-center gap-4 rounded-xl border border-white/8 bg-black/20 p-3">
                    <div className="border-r border-white/8 pr-4 text-center">
                      <p className="race-number text-xl text-white">{formatShortDate(upcomingRace.race_date).split(" ")[1]}</p>
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-red-400">{formatShortDate(upcomingRace.race_date).split(" ")[0]}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-slate-600">Race weekend</p>
                      <p className="mt-1 text-xs font-bold text-slate-200">{formatDate(upcomingRace.race_date)}</p>
                    </div>
                  </div>

                  <Link to={`/races/${upcomingRace.id}`} className="mt-4 flex items-center justify-between rounded-xl border border-white/10 px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.13em] text-white transition hover:border-red-500/50 hover:bg-red-500/8">
                    Open race center <Icon name="arrow-right" className="h-4 w-4 text-red-400" />
                  </Link>
                </>
              ) : (
                <div className="py-14 text-center">
                  <Icon name="flag" className="mx-auto h-9 w-9 text-slate-700" />
                  <h2 className="mt-5 text-2xl font-black text-white">Calendar pending</h2>
                  <p className="mt-2 text-sm text-slate-500">The next race will appear here as soon as it is scheduled.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="page-eyebrow">Season pulse</p>
            <h2>At a glance</h2>
          </div>
          <Link to="/races" className="section-link">Full calendar <Icon name="arrow-right" className="h-4 w-4" /></Link>
        </div>

        <div className="season-pulse-grid grid gap-4 md:grid-cols-3">
          <article className="pulse-card pulse-card--championship card-lift">
            <div className="pulse-icon"><Icon name="trophy" className="h-5 w-5" /></div>
            <p className="pulse-label">Current championship</p>
            <h3 className="race-number mt-4 text-4xl text-slate-950 dark:text-white">{currentSeason?.year ?? "—"}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{currentSeason?.name ?? "Season data pending"}</p>
          </article>

          <article className="pulse-card pulse-card--upcoming card-lift">
            <div className="pulse-icon"><Icon name="calendar" className="h-5 w-5" /></div>
            <p className="pulse-label">Up next</p>
            {upcomingRace ? (
              <Link to={`/races/${upcomingRace.id}`} className="mt-4 block text-xl font-extrabold tracking-tight text-slate-950 hover:text-red-600 dark:text-white dark:hover:text-red-400">{upcomingRace.name}</Link>
            ) : <h3 className="mt-4 text-xl font-extrabold">No upcoming race</h3>}
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{upcomingRace?.circuit_name ?? "Calendar pending"} · {formatShortDate(upcomingRace?.race_date ?? null)}</p>
          </article>

          <article className="pulse-card pulse-card--latest card-lift">
            <div className="pulse-icon"><Icon name="flag" className="h-5 w-5" /></div>
            <p className="pulse-label">Last chequered flag</p>
            {latestRaceQuery.isError || !latestRace ? (
              <><h3 className="mt-4 text-xl font-extrabold text-slate-950 dark:text-white">Awaiting result</h3><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Completed races will appear here.</p></>
            ) : (
              <><Link to={`/races/${latestRace.id}`} className="mt-4 block text-xl font-extrabold tracking-tight text-slate-950 hover:text-red-600 dark:text-white dark:hover:text-red-400">{latestRace.name}</Link><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{latestRace.circuit_name} · {formatShortDate(latestRace.race_date)}</p></>
            )}
          </article>
        </div>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <p className="page-eyebrow">From the paddock</p>
            <h2>Featured stories</h2>
          </div>
          <Link to="/articles" className="section-link">View all stories <Icon name="arrow-right" className="h-4 w-4" /></Link>
        </div>

        {featuredArticles.length === 0 ? (
          <div className="state-panel"><p className="text-sm text-slate-600 dark:text-slate-300">No featured articles yet.</p></div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {featuredArticles.map((article, index) => (
              <article key={article.id} className={`story-card card-lift ${index === 0 ? "story-card--lead lg:row-span-2" : ""}`}>
                <Link to={`/articles/${article.slug}`} className="story-image-wrap">
                  <ImageWithFallback src={article.cover_image} alt={article.title} fallbackLabel={article.category_name ?? "Article"} className="h-full w-full object-cover" />
                  <span className="story-image-overlay" />
                </Link>
                <div className="story-copy">
                  <span className="story-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.17em] text-red-500">{article.category_name ?? "Insight"}</p>
                  </div>
                  <Link to={`/articles/${article.slug}`}>
                    <h3 className="mt-3 text-xl font-extrabold leading-tight tracking-tight text-slate-950 transition hover:text-red-600 dark:text-white dark:hover:text-red-400">{article.title}</h3>
                  </Link>
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">{article.summary || article.subtitle || "No summary available."}</p>
                  <Link to={`/articles/${article.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-900 dark:text-white">Read analysis <Icon name="arrow-right" className="h-4 w-4 text-red-500" /></Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="explore-band">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-400">The complete grid</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Know every driver. Track every team.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Explore detailed career profiles, constructor history, power units, race records, and the championship data connecting the entire paddock.</p>
        </div>
        <div className="flex flex-wrap gap-3 lg:justify-end">
          <Link to="/drivers" className="rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-red-500 hover:text-white">Meet the drivers</Link>
          <Link to="/teams" className="rounded-xl border border-white/12 px-5 py-3 text-sm font-extrabold text-white transition hover:border-white/25 hover:bg-white/5">Explore teams</Link>
        </div>
      </section>
    </div>
  );
}
