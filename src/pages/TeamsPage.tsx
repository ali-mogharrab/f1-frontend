import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import {
  addFavoriteTeam,
  getFavoriteTeams,
  removeFavoriteTeam,
} from "../api/authApi";
import { getTeams } from "../api/racingApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { PageHeader } from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { ImageWithFallback } from "../components/common/ImageWithFallback";
import { ListControls } from "../components/common/ListControls";

const teamSortOptions = [
  { label: "Name A-Z", value: "name" },
  { label: "Name Z-A", value: "-name" },
  { label: "Most titles", value: "-world_championships" },
  { label: "Oldest entry", value: "first_team_entry" },
  { label: "Newest entry", value: "-first_team_entry" },
];

const teamStatusOptions = [
  { label: "All teams", value: "" },
  { label: "Active", value: "true" },
  { label: "Inactive", value: "false" },
];

export function TeamsPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("");
  const [ordering, setOrdering] = useState(teamSortOptions[0].value);

  const queryParams = useMemo(
    () => ({
      search: search.trim() || undefined,
      is_active: isActive || undefined,
      ordering,
    }),
    [isActive, ordering, search],
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teams", queryParams],
    queryFn: () => getTeams(queryParams),
    placeholderData: keepPreviousData,
  });

  const favoriteTeamsQuery = useQuery({
    queryKey: ["favorite-teams"],
    queryFn: getFavoriteTeams,
    enabled: isAuthenticated,
  });

  const addFavoriteTeamMutation = useMutation({
    mutationFn: addFavoriteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-teams"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
  });

  const removeFavoriteTeamMutation = useMutation({
    mutationFn: removeFavoriteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-teams"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
  });

  if (isLoading) {
    return <LoadingMessage message="Loading teams..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Could not load teams"
        message={
          error instanceof Error
            ? error.message
            : "Something went wrong while loading teams."
        }
      />
    );
  }

  const teams = data?.results ?? [];
  const favoriteTeams = favoriteTeamsQuery.data?.data ?? [];

  return (
    <section>
      <PageHeader
        eyebrow="Racing"
        title="Teams"
        description="Browse Formula 1 teams by name, country, staff, and power unit."
      />

      <ListControls
        searchValue={search}
        searchPlaceholder="Search teams, countries, principals..."
        onSearchChange={setSearch}
        sortValue={ordering}
        onSortChange={setOrdering}
        sortOptions={teamSortOptions}
        resultCount={data?.count}
        filters={[
          {
            label: "Status",
            value: isActive,
            onChange: setIsActive,
            options: teamStatusOptions,
          },
        ]}
      />

      {teams.length === 0 ? (
        <EmptyState message="No teams match the current view." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => {
            const favorite = favoriteTeams.find(
              (favoriteTeam) => favoriteTeam.team === team.id,
            );

            const isFavorite = Boolean(favorite);

            const isAdding =
              addFavoriteTeamMutation.isPending &&
              addFavoriteTeamMutation.variables === team.id;

            const isRemoving =
              removeFavoriteTeamMutation.isPending &&
              removeFavoriteTeamMutation.variables === favorite?.id;

            return (
              <article
                key={team.id}
                className="surface-panel card-lift group rounded-3xl p-5"
              >
                <Link
                  to={`/teams/${team.id}`}
                  className="team-logo-stage mb-5 flex h-32 items-center justify-center rounded-2xl p-5"
                >
                  <ImageWithFallback
                    src={team.logo}
                    alt={team.name}
                    fallbackLabel={team.name}
                    className="max-h-20 w-full object-contain transition duration-300 group-hover:scale-105"
                  />
                </Link>
                
                <div className="mb-4">
                  <Link
                    to={`/teams/${team.id}`}
                    className="text-xl font-bold text-slate-950 hover:text-red-600 dark:text-white dark:hover:text-red-400"
                  >
                    {team.name}
                  </Link>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {team.official_name || "No official name"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Country:
                    </span>{" "}
                    {team.country || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">Base:</span>{" "}
                    {team.base_location || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Power unit:
                    </span>{" "}
                    {team.power_unit || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      Championships:
                    </span>{" "}
                    {team.world_championships}
                  </p>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <Link
                    to={`/teams/${team.id}`}
                    className="mb-3 block text-sm font-semibold text-red-600 hover:underline dark:text-red-400"
                  >
                    View team profile
                  </Link>

                  {!isAuthenticated ? (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Login to add this team to favorites.
                    </p>
                  ) : isFavorite && favorite ? (
                    <button
                      type="button"
                      disabled={isRemoving}
                      onClick={() =>
                        removeFavoriteTeamMutation.mutate(favorite.id)
                      }
                      className="w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                      {isRemoving ? "Removing..." : "Remove from favorites"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isAdding}
                      onClick={() => addFavoriteTeamMutation.mutate(team.id)}
                      className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
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
