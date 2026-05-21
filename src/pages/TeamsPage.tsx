import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function TeamsPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
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
        description="Browse Formula 1 teams from your Django REST API."
      />

      {teams.length === 0 ? (
        <EmptyState message="No teams found. Try running the backend seed command." />
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
                className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-24 items-center justify-center rounded-2xl bg-slate-50 p-4">
                  <ImageWithFallback
                    src={team.logo}
                    alt={team.name}
                    fallbackLabel={team.name}
                    className="max-h-16 w-full object-contain"
                  />
                </div>
                
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-slate-950">
                    {team.name}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {team.official_name || "No official name"}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">
                      Country:
                    </span>{" "}
                    {team.country || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">Base:</span>{" "}
                    {team.base_location || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">
                      Power unit:
                    </span>{" "}
                    {team.power_unit || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">
                      Championships:
                    </span>{" "}
                    {team.world_championships}
                  </p>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  {!isAuthenticated ? (
                    <p className="text-sm text-slate-500">
                      Login to add this team to favorites.
                    </p>
                  ) : isFavorite && favorite ? (
                    <button
                      type="button"
                      disabled={isRemoving}
                      onClick={() =>
                        removeFavoriteTeamMutation.mutate(favorite.id)
                      }
                      className="w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400"
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