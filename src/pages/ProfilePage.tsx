import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { getProfile, updateProfile } from "../api/authApi";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingMessage } from "../components/common/LoadingMessage";
import { PageHeader } from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../utils/apiError";

export function ProfilePage() {
  const queryClient = useQueryClient();
  const { isAuthenticated, refreshUser } = useAuth();

  const [bio, setBio] = useState("");
  const [country, setCountry] = useState("");
  const [favoriteDriverName, setFavoriteDriverName] = useState("");
  const [favoriteTeamName, setFavoriteTeamName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    enabled: isAuthenticated,
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      setSuccessMessage("Profile updated successfully.");
      setErrorMessage("");

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["user-dashboard"] });

      await refreshUser();
    },
    onError: (error) => {
      setSuccessMessage("");
      setErrorMessage(getApiErrorMessage(error));
    },
  });

  useEffect(() => {
    const profile = profileQuery.data?.data;
    let isCurrent = true;

    if (profile) {
      queueMicrotask(() => {
        if (!isCurrent) {
          return;
        }

        setBio(profile.bio ?? "");
        setCountry(profile.country ?? "");
        setFavoriteDriverName(profile.favorite_driver_name ?? "");
        setFavoriteTeamName(profile.favorite_team_name ?? "");
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [profileQuery.data]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateProfileMutation.mutate({
      bio,
      country,
      favorite_driver_name: favoriteDriverName,
      favorite_team_name: favoriteTeamName,
    });
  }

  if (profileQuery.isLoading) {
    return <LoadingMessage message="Loading profile..." />;
  }

  if (profileQuery.isError) {
    return (
      <ErrorMessage
        title="Could not load profile"
        message="Something went wrong while loading your profile."
      />
    );
  }

  return (
    <section className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="Update your public Formula 1 profile information."
      />

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-slate-950 dark:text-white">
              Account security
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Keep your sign-in password current.
            </p>
          </div>

          <Link
            to="/change-password"
            className="rounded-xl bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-red-600 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-red-500 dark:hover:text-white"
          >
            Change password
          </Link>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900 sm:p-8">
        {successMessage ? (
          <div className="mb-6 rounded-2xl bg-green-50 p-4 text-green-700 dark:bg-green-950/40 dark:text-green-300">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-6">
            <ErrorMessage title="Profile update failed" message={errorMessage} />
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="bio"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Bio
            </label>

            <textarea
              id="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              placeholder="Tell us about your Formula 1 interests..."
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Country
            </label>

            <input
              id="country"
              type="text"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              placeholder="Example: Türkiye"
            />
          </div>

          <div>
            <label
              htmlFor="favoriteDriverName"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Favorite driver name
            </label>

            <input
              id="favoriteDriverName"
              type="text"
              value={favoriteDriverName}
              onChange={(event) => setFavoriteDriverName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              placeholder="Example: Max Verstappen"
            />
          </div>

          <div>
            <label
              htmlFor="favoriteTeamName"
              className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Favorite team name
            </label>

            <input
              id="favoriteTeamName"
              type="text"
              value={favoriteTeamName}
              onChange={(event) => setFavoriteTeamName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:focus:ring-red-950"
              placeholder="Example: Ferrari"
            />
          </div>

          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="w-full rounded-xl bg-red-600 px-4 py-3 font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </section>
  );
}
