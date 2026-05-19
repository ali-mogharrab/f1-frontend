import { apiClient } from "./client";
import type { PaginatedResponse } from "../types/api";
import type { Driver, Race, Team } from "../types/racing";

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

export async function getRaces() {
  const response = await apiClient.get<PaginatedResponse<Race>>(
    "/racing/races/",
  );

  return response.data;
}