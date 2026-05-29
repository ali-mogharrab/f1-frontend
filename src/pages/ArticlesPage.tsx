import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../api/contentApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { PageHeader } from "../components/common/PageHeader";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { ListControls } from "../components/common/ListControls";

const articleSortOptions = [
  { label: "Newest published", value: "-published_at" },
  { label: "Oldest published", value: "published_at" },
  { label: "Most viewed", value: "-views_count" },
  { label: "Title A-Z", value: "title" },
  { label: "Title Z-A", value: "-title" },
];

function formatDate(dateValue: string | null) {
  if (!dateValue) {
    return "Not published";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue));
}

export function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [ordering, setOrdering] = useState(articleSortOptions[0].value);

  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      ordering,
    }),
    [ordering, search],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["articles", queryParams],
    queryFn: () => getArticles(queryParams),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <LoadingMessage message="Loading articles..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Could not load articles"
        message={
          error instanceof Error
            ? error.message
            : "Something went wrong while loading articles."
        }
      />
    );
  }

  const articles = data?.results ?? [];

  return (
    <section>
      <PageHeader
        eyebrow="Content"
        title="Articles"
        description="Read Formula 1 previews, stories, analysis, and race coverage."
      />

      <ListControls
        searchValue={search}
        searchPlaceholder="Search stories, categories, tags..."
        onSearchChange={setSearch}
        sortValue={ordering}
        onSortChange={setOrdering}
        sortOptions={articleSortOptions}
        resultCount={data?.count}
      />

      {articles.length === 0 ? (
        <EmptyState message="No articles match the current view." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article
              key={article.id}
              className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg dark:bg-slate-900 dark:ring-slate-800"
            >
              <ImageWithFallback
                src={article.cover_image}
                alt={article.title}
                fallbackLabel={article.category_name ?? "Article"}
                className="h-48 w-full object-cover"
              />

              <div className="flex min-h-64 flex-col p-5">
                <div className="mb-4">
                  <p className="mb-2 text-sm font-semibold text-red-600 dark:text-red-400">
                    {article.category_name ?? "Article"}
                  </p>

                  <h2 className="text-xl font-bold text-slate-950 dark:text-white">
                    {article.title}
                  </h2>

                  {article.subtitle ? (
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {article.subtitle}
                    </p>
                  ) : null}
                </div>

                <p className="line-clamp-4 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {article.summary || "No summary available."}
                </p>

                <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatDate(article.published_at)}
                  </span>

                  <Link
                    to={`/articles/${article.slug}`}
                    className="font-semibold text-red-600 hover:underline dark:text-red-400"
                  >
                    Read more
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
