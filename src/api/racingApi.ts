import { apiClient } from "./client";
import type { PaginatedResponse } from "../types/api";
import type { Driver, Team } from "../types/racing";

export async function getDrivers() {
  const response = await apiClient.get<PaginatedResponse<Driver>>(
    "/racing/drivers/",
  );

  return response.data;
}

export async function getTeams() {
  const response = await apiClient.get<PaginatedResponse<Team>>(
    "/racing/teams/",
  );

  return response.data;
}