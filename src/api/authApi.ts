import { apiClient } from "./client";
import type {
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