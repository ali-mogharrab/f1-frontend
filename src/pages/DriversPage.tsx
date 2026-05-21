import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavoriteDriver,
  getFavoriteDrivers,
  removeFavoriteDriver,
} from "../api/authApi";
import { getDrivers } from "../api/racingApi";
import { EmptyState } from "../components/common/EmptyState";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { PageHeader } from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { ImageWithFallback } from "../components/common/ImageWithFallback";

export function DriversPage() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["drivers"],
    queryFn: getDrivers,
  });

  const favoriteDriversQuery = useQuery({
    queryKey: ["favorite-drivers"],
    queryFn: getFavoriteDrivers,
    enabled: isAuthenticated,
  });

  const addFavoriteDriverMutation = useMutation({
    mutationFn: addFavoriteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-drivers"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
  });

  const removeFavoriteDriverMutation = useMutation({
    mutationFn: removeFavoriteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-drivers"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });
    },
  });

  if (isLoading) {
    return <LoadingMessage message="Loading drivers..." />;
  }

  if (isError) {
    return (
      <ErrorMessage
        title="Could not load drivers"
        message={
          error instanceof Error
            ? error.message
            : "Something went wrong while loading drivers."
        }
      />
    );
  }

  const drivers = data?.results ?? [];
  const favoriteDrivers = favoriteDriversQuery.data?.data ?? [];

  return (
    <section>
      <PageHeader
        eyebrow="Racing"
        title="Drivers"
        description="Browse Formula 1 drivers from your Django REST API."
      />

      {drivers.length === 0 ? (
        <EmptyState message="No drivers found. Try running the backend seed command." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {drivers.map((driver) => {
            const favorite = favoriteDrivers.find(
              (favoriteDriver) => favoriteDriver.driver === driver.id,
            );

            const isFavorite = Boolean(favorite);

            const isAdding =
              addFavoriteDriverMutation.isPending &&
              addFavoriteDriverMutation.variables === driver.id;

            const isRemoving =
              removeFavoriteDriverMutation.isPending &&
              removeFavoriteDriverMutation.variables === favorite?.id;

            return (
              <article
                key={driver.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <ImageWithFallback
                  src={driver.image}
                  alt={driver.full_name}
                  fallbackLabel={driver.abbreviation}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-950">
                        {driver.full_name}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {driver.country || "Unknown country"}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700">
                      {driver.abbreviation}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-900">
                        Number:
                      </span>{" "}
                      {driver.number ?? "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">Team:</span>{" "}
                      {driver.current_team_name ?? "No team"}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-900">
                        Status:
                      </span>{" "}
                      {driver.status}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    {!isAuthenticated ? (
                      <p className="text-sm text-slate-500">
                        Login to add this driver to favorites.
                      </p>
                    ) : isFavorite && favorite ? (
                      <button
                        type="button"
                        disabled={isRemoving}
                        onClick={() => removeFavoriteDriverMutation.mutate(favorite.id)}
                        className="w-full rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:text-slate-400"
                      >
                        {isRemoving ? "Removing..." : "Remove from favorites"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isAdding}
                        onClick={() => addFavoriteDriverMutation.mutate(driver.id)}
                        className="w-full rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                      >
                        {isAdding ? "Adding..." : "Add to favorites"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}