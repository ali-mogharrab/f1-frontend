import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  getCurrentSeason,
  getLatestRace,
  getUpcomingRace,
} from "../api/racingApi";
import { getFeaturedArticles } from "../api/contentApi";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { ImageWithFallback } from "../components/common/ImageWithFallback";

function formatDate(dateValue: string | null) {
  if (!dateValue) {
    return "Date not available";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue));
}

export function HomePage() {
  const currentSeasonQuery = useQuery({
    queryKey: ["current-season"],
    queryFn: getCurrentSeason,
  });

  const upcomingRaceQuery = useQuery({
    queryKey: ["upcoming-race"],
    queryFn: getUpcomingRace,
  });

  const latestRaceQuery = useQuery({
    queryKey: ["latest-race"],
    queryFn: getLatestRace,
    retry: false,
  });

  const featuredArticlesQuery = useQuery({
    queryKey: ["featured-articles"],
    queryFn: () => getFeaturedArticles(),
  });

  const isLoading =
    currentSeasonQuery.isLoading ||
    upcomingRaceQuery.isLoading ||
    featuredArticlesQuery.isLoading;

  const hasImportantError =
    currentSeasonQuery.isError ||
    upcomingRaceQuery.isError ||
    featuredArticlesQuery.isError;

  if (isLoading) {
    return <LoadingMessage message="Loading home page..." />;
  }

  if (hasImportantError) {
    return (
      <ErrorMessage
        title="Could not load home page"
        message="Refresh again"
      />
    );
  }

  const currentSeason = currentSeasonQuery.data;
  const upcomingRace = upcomingRaceQuery.data;
  const latestRace = latestRaceQuery.data;
  const featuredArticles = featuredArticlesQuery.data?.results ?? [];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-red-600/30 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

        <div className="relative">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-400">
            Formula 1
          </p>

          <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Follow Formula 1 data, races, standings, and stories.
          </h1>

          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Formula 1 is the pinnacle of motorsport and the world's most prestigious motor racing competition.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/drivers"
              className="rounded-xl bg-red-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-red-700"
            >
              Explore drivers
            </Link>

            <Link
              to="/articles"
              className="rounded-xl bg-white px-5 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-slate-100 dark:bg-slate-100 dark:hover:bg-white"
            >
              Read articles
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
            Current season
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
            {currentSeason?.year}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {currentSeason?.name}
          </p>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
            Upcoming race
          </p>
          {upcomingRace ? (
            <Link
              to={`/races/${upcomingRace.id}`}
              className="mt-2 block text-2xl font-bold text-slate-950 hover:text-red-600 dark:text-white dark:hover:text-red-400"
            >
              {upcomingRace.name}
            </Link>
          ) : (
            <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
              No upcoming race
            </h2>
          )}
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {upcomingRace?.circuit_name} · {formatDate(upcomingRace?.race_date ?? null)}
          </p>
        </article>

        <article className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
            Latest race
          </p>

          {latestRaceQuery.isError || !latestRace ? (
            <>
              <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                No completed race
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Completed races will appear here later.
              </p>
            </>
          ) : (
            <>
              <Link
                to={`/races/${latestRace.id}`}
                className="mt-2 block text-2xl font-bold text-slate-950 hover:text-red-600 dark:text-white dark:hover:text-red-400"
              >
                {latestRace.name}
              </Link>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {latestRace.circuit_name} · {formatDate(latestRace.race_date)}
              </p>
            </>
          )}
        </article>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
              Featured
            </p>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white">
              Featured articles
            </h2>
          </div>

          <Link to="/articles" className="text-sm font-semibold text-red-600 dark:text-red-400">
            View all
          </Link>
        </div>

        {featuredArticles.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-slate-900">
            <p className="text-slate-600 dark:text-slate-300">
              No featured articles yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {featuredArticles.map((article) => (
              <article
                key={article.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 dark:ring-slate-800"
              >
                <ImageWithFallback
                  src={article.cover_image}
                  alt={article.title}
                  fallbackLabel={article.category_name ?? "Article"}
                  className="h-44 w-full object-cover"
                />

                <div className="p-5">
                  <p className="mb-2 text-sm font-semibold text-red-600 dark:text-red-400">
                    {article.category_name ?? "Article"}
                  </p>

                  <h3 className="text-xl font-bold text-slate-950 dark:text-white">
                    {article.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                    {article.summary || article.subtitle || "No summary available."}
                  </p>

                  <Link
                    to={`/articles/${article.slug}`}
                    className="mt-4 inline-block text-sm font-semibold text-red-600 hover:underline dark:text-red-400"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
