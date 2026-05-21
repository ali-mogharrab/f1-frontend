import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getArticleBySlug } from "../api/contentApi";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { ImageWithFallback } from "../components/common/ImageWithFallback";

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

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => getArticleBySlug(slug as string),
    enabled: Boolean(slug),
  });

  if (!slug) {
    return (
      <ErrorMessage
        title="Article not found"
        message="The article URL is missing a slug."
      />
    );
  }

  if (isLoading) {
    return <LoadingMessage message="Loading article..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Could not load article"
        message={
          error instanceof Error
            ? error.message
            : "Something went wrong while loading the article."
        }
      />
    );
  }

  if (!data) {
    return (
      <ErrorMessage
        title="Article not found"
        message="The article could not be found."
      />
    );
  }

  const article = data;

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        to="/articles"
        className="mb-6 inline-block text-sm font-semibold text-red-600 hover:underline"
      >
        ← Back to articles
      </Link>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 sm:p-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-600">
          {article.category_name ?? "Article"}
        </p>

        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          {article.title}
        </h1>

        {article.subtitle ? (
          <p className="mt-4 text-xl text-slate-600">{article.subtitle}</p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
          <span>{formatDate(article.published_at)}</span>
          <span>·</span>
          <span>{article.views_count} views</span>

          {article.author_username ? (
            <>
              <span>·</span>
              <span>By {article.author_username}</span>
            </>
          ) : null}
        </div>

        {article.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-3xl">
          <ImageWithFallback
            src={article.cover_image}
            alt={article.title}
            fallbackLabel={article.category_name ?? "Article"}
            className="h-72 w-full object-cover sm:h-96"
          />
        </div>

        {article.summary ? (
          <p className="mt-8 rounded-2xl bg-slate-50 p-5 text-lg leading-8 text-slate-700">
            {article.summary}
          </p>
        ) : null}

        <div className="mt-8 whitespace-pre-line text-base leading-8 text-slate-700">
          {article.content}
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-500">
          {article.related_race_name ? (
            <p>
              Related race:{" "}
              <span className="font-semibold text-slate-700">
                {article.related_race_name}
              </span>
            </p>
          ) : null}

          {article.related_driver_name ? (
            <p>
              Related driver:{" "}
              <span className="font-semibold text-slate-700">
                {article.related_driver_name}
              </span>
            </p>
          ) : null}

          {article.related_team_name ? (
            <p>
              Related team:{" "}
              <span className="font-semibold text-slate-700">
                {article.related_team_name}
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}