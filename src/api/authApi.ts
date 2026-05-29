import { apiClient } from "./client";
import type {
  FavoriteDriver,
  FavoriteRace,
  FavoriteTeam,
  ChangePasswordPayload,
  LoginPayload,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  RegisterPayload,
  SuccessResponse,
  TokenPair,
  User,
  UserDashboard,
  UserProfile,
  VerifyTokenPayload,
} from "../types/auth";

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<TokenPair>("/users/token/", payload);
  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await apiClient.post<SuccessResponse<User>>(
    "/users/register/",
    payload,
  );

  return response.data;
}

export async function verifyToken(payload: VerifyTokenPayload) {
  await apiClient.post("/users/token/verify/", payload);
}

export async function changePassword(payload: ChangePasswordPayload) {
  const response = await apiClient.post<SuccessResponse<null>>(
    "/users/password/change/",
    payload,
  );

  return response.data;
}

export async function requestPasswordReset(
  payload: PasswordResetRequestPayload,
) {
  const response = await apiClient.post<SuccessResponse<null>>(
    "/users/password/reset/",
    payload,
  );

  return response.data;
}

export async function confirmPasswordReset(
  payload: PasswordResetConfirmPayload,
) {
  const response = await apiClient.post<SuccessResponse<null>>(
    "/users/password/reset/confirm/",
    payload,
  );

  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get<SuccessResponse<User>>("/users/me/");
  return response.data;
}

export async function getUserDashboard() {
  const response =
    await apiClient.get<SuccessResponse<UserDashboard>>("/users/dashboard/");

  return response.data;
}

export async function getFavoriteDrivers() {
  const response =
    await apiClient.get<SuccessResponse<FavoriteDriver[]>>(
      "/users/favorites/drivers/",
    );

  return response.data;
}

export async function addFavoriteDriver(driverId: string) {
  const response = await apiClient.post<SuccessResponse<FavoriteDriver>>(
    "/users/favorites/drivers/",
    {
      driver: driverId,
    },
  );

  return response.data;
}

export async function removeFavoriteDriver(favoriteId: string) {
  const response = await apiClient.delete<SuccessResponse<null>>(
    `/users/favorites/drivers/${favoriteId}/`,
  );

  return response.data;
}

export async function getFavoriteTeams() {
  const response =
    await apiClient.get<SuccessResponse<FavoriteTeam[]>>(
      "/users/favorites/teams/",
    );

  return response.data;
}

export async function addFavoriteTeam(teamId: string) {
  const response = await apiClient.post<SuccessResponse<FavoriteTeam>>(
    "/users/favorites/teams/",
    {
      team: teamId,
    },
  );

  return response.data;
}

export async function removeFavoriteTeam(favoriteId: string) {
  const response = await apiClient.delete<SuccessResponse<null>>(
    `/users/favorites/teams/${favoriteId}/`,
  );

  return response.data;
}

export async function getFavoriteRaces() {
  const response =
    await apiClient.get<SuccessResponse<FavoriteRace[]>>(
      "/users/favorites/races/",
    );

  return response.data;
}

export async function addFavoriteRace(raceId: string) {
  const response = await apiClient.post<SuccessResponse<FavoriteRace>>(
    "/users/favorites/races/",
    {
      race: raceId,
    },
  );

  return response.data;
}

export async function removeFavoriteRace(favoriteId: string) {
  const response = await apiClient.delete<SuccessResponse<null>>(
    `/users/favorites/races/${favoriteId}/`,
  );

  return response.data;
}

export async function getProfile() {
  const response = await apiClient.get<SuccessResponse<UserProfile>>(
    "/users/profile/",
  );

  return response.data;
}

export type UpdateProfilePayload = {
  bio?: string;
  country?: string;
  favorite_driver_name?: string;
  favorite_team_name?: string;
};

export async function updateProfile(payload: UpdateProfilePayload) {
  const response = await apiClient.patch<SuccessResponse<UserProfile>>(
    "/users/profile/",
    payload,
  );

  return response.data;
}
