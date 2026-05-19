import { apiClient } from "./client";
import type { PaginatedResponse } from "../types/api";
import type { Driver, Race, Season, Team } from "../types/racing";

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

export async function getCurrentSeason() {
  const response = await apiClient.get<Season>("/racing/seasons/current/");
  return response.data;
}

export async function getUpcomingRace() {
  const response = await apiClient.get<Race>("/racing/races/upcoming/");
  return response.data;
}

export async function getLatestRace() {
  const response = await apiClient.get<Race>("/racing/races/latest/");
  return response.data;
}