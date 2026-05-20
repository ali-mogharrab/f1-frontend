import { apiClient } from "./client";
import type {
  FavoriteDriver,
  FavoriteRace,
  FavoriteTeam,
  LoginPayload,
  SuccessResponse,
  TokenPair,
  User,
  UserDashboard,
} from "../types/auth";

export async function login(payload: LoginPayload) {
  const response = await apiClient.post<TokenPair>("/users/token/", payload);
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
