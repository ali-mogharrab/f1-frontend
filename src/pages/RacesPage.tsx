import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  addFavoriteRace,
  getFavoriteRaces,
  removeFavoriteRace,
} from "../api/authApi";
import { getRaces } from "../api/racingApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { PageHeader } from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { ListControls } from "../components/common/ListControls";

const raceSortOptions = [
  { label: "Calendar order", value: "season__year,round_number" },
  { label: "Newest first", value: "-race_date" },
  { label: "Oldest first", value: "race_date" },
  { label: "Round low-high", value: "round_number" },
  { label: "Round high-low", value: "-round_number" },
];

const raceStatusOptions = [
  { label: "All statuses", value: "" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Completed", value: "completed" },
  { label: "Postponed", value: "postponed" },
  { label: "Cancelled", value: "cancelled" },
];

function formatDate(dateValue: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateValue));
}

export function RacesPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [ordering, setOrdering] = useState(raceSortOptions[0].value);

  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      status: status || undefined,
      ordering,
    }),
    [ordering, search, status],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["races", queryParams],
    queryFn: () => getRaces(queryParams),
    placeholderData: keepPreviousData,
  });

  const favoriteRacesQuery = useQuery({
    queryKey: ["favorite-races"],
    queryFn: getFavoriteRaces,
    enabled: isAuthenticated,
  });

  const addFavoriteRaceMutation = useMutation({
    mutationFn: addFavoriteRace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-races"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
  });

  const removeFavoriteRaceMutation = useMutation({
    mutationFn: removeFavoriteRace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-races"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
  });

  if (isLoading) {
    return <LoadingMessage message="Loading races..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Could not load races"
        message={
          error instanceof Error
            ? error.message
            : "Something went wrong while loading races."
        }
      />
    );
  }

  const races = data?.results ?? [];
  const favoriteRaces = favoriteRacesQuery.data?.data ?? [];

  return (
    <section>
      <PageHeader
        eyebrow="Calendar"
        title="Races"
        description="Browse Formula 1 races, circuits, rounds, statuses, and scheduled dates."
      />

      <ListControls
        searchValue={search}
        searchPlaceholder="Search races, circuits, countries..."
        onSearchChange={setSearch}
        sortValue={ordering}
        onSortChange={setOrdering}
        sortOptions={raceSortOptions}
        resultCount={data?.count}
        filters={[
          {
            label: "Status",
            value: status,
            onChange: setStatus,
            options: raceStatusOptions,
          },
        ]}
      />

      {races.length === 0 ? (
        <EmptyState message="No races match the current view." />
      ) : (
        <div className="space-y-4">
          {races.map((race) => {
            const favorite = favoriteRaces.find(
              (favoriteRace) => favoriteRace.race === race.id,
            );

            const isFavorite = Boolean(favorite);

            const isAdding =
              addFavoriteRaceMutation.isPending &&
              addFavoriteRaceMutation.variables === race.id;

            const isRemoving =
              removeFavoriteRaceMutation.isPending &&
              removeFavoriteRaceMutation.variables === favorite?.id;

            return (
              <article
                key={race.id}
                className="rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:bg-slate-900"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                      Round {race.round_number} · {race.season_year}
                    </p>

                    <Link
                      to={`/races/${race.id}`}
                      className="text-2xl font-bold text-slate-950 hover:text-red-600 dark:text-white dark:hover:text-red-400"
                    >
                      {race.name}
                    </Link>

                    <p className="mt-1 text-slate-500 dark:text-slate-400">
                      {race.official_name || "No official name"}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold capitalize text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    {race.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 text-sm text-slate-600 dark:text-slate-300 md:grid-cols-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Race date</p>
                    <p>{formatDate(race.race_date)}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Circuit</p>
                    <p>{race.circuit_name}</p>
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Country</p>
                    <p>{race.circuit_country}</p>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <Link
                    to={`/races/${race.id}`}
                    className="mb-3 block text-sm font-semibold text-red-600 hover:underline dark:text-red-400"
                  >
                    View race details
                  </Link>

                  {!isAuthenticated ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Login to add this race to favorites.
                    </p>
                  ) : isFavorite && favorite ? (
                    <button
                      type="button"
                      disabled={isRemoving}
                      onClick={() =>
                        removeFavoriteRaceMutation.mutate(favorite.id)
                      }
                      className="w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 md:w-auto"
                    >
                      {isRemoving ? "Removing..." : "Remove from favorites"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isAdding}
                      onClick={() => addFavoriteRaceMutation.mutate(race.id)}
                      className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 md:w-auto"
                    >
                      {isAdding ? "Adding..." : "Add to favorites"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
