import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
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

    if (profile) {
      setBio(profile.bio ?? "");
      setCountry(profile.country ?? "");
      setFavoriteDriverName(profile.favorite_driver_name ?? "");
      setFavoriteTeamName(profile.favorite_team_name ?? "");
    }
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

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        {successMessage ? (
          <div className="mb-6 rounded-2xl bg-green-50 p-4 text-green-700">
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
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Bio
            </label>

            <textarea
              id="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={5}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              placeholder="Tell us about your Formula 1 interests..."
            />
          </div>

          <div>
            <label
              htmlFor="country"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Country
            </label>

            <input
              id="country"
              type="text"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              placeholder="Example: Türkiye"
            />
          </div>

          <div>
            <label
              htmlFor="favoriteDriverName"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Favorite driver name
            </label>

            <input
              id="favoriteDriverName"
              type="text"
              value={favoriteDriverName}
              onChange={(event) => setFavoriteDriverName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              placeholder="Example: Max Verstappen"
            />
          </div>

          <div>
            <label
              htmlFor="favoriteTeamName"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Favorite team name
            </label>

            <input
              id="favoriteTeamName"
              type="text"
              value={favoriteTeamName}
              onChange={(event) => setFavoriteTeamName(event.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
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