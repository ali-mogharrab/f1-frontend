import { apiClient } from "./client";
import type {
  FavoriteDriver,
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