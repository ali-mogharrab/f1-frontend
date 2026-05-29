import { apiClient } from "./client";
import type { ListQueryParams, PaginatedResponse } from "../types/api";
import type {
  Circuit,
  Driver,
  QualifyingResult,
  Race,
  RaceResult,
  Season,
  SprintResult,
  Team,
} from "../types/racing";

export async function getSeasons(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<Season>>(
    "/racing/seasons/",
    { params },
  );

  return response.data;
}

export async function getSeason(id: string) {
  const response = await apiClient.get<Season>(`/racing/seasons/${id}/`);
  return response.data;
}

export async function getDrivers(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<Driver>>(
    "/racing/drivers/",
    { params },
  );

  return response.data;
}

export async function getDriver(id: string) {
  const response = await apiClient.get<Driver>(`/racing/drivers/${id}/`);
  return response.data;
}

export async function getTeams(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<Team>>(
    "/racing/teams/",
    { params },
  );

  return response.data;
}

export async function getTeam(id: string) {
  const response = await apiClient.get<Team>(`/racing/teams/${id}/`);
  return response.data;
}

export async function getCircuits(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<Circuit>>(
    "/racing/circuits/",
    { params },
  );

  return response.data;
}

export async function getCircuit(id: string) {
  const response = await apiClient.get<Circuit>(`/racing/circuits/${id}/`);
  return response.data;
}

export async function getRaces(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<Race>>(
    "/racing/races/",
    { params },
  );

  return response.data;
}

export async function getRace(id: string) {
  const response = await apiClient.get<Race>(`/racing/races/${id}/`);
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

export async function getRaceResults(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<RaceResult>>(
    "/racing/race-results/",
    { params },
  );

  return response.data;
}

export async function getRaceResult(id: string) {
  const response = await apiClient.get<RaceResult>(
    `/racing/race-results/${id}/`,
  );
  return response.data;
}

export async function getQualifyingResults(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<QualifyingResult>>(
    "/racing/qualifying-results/",
    { params },
  );

  return response.data;
}

export async function getQualifyingResult(id: string) {
  const response = await apiClient.get<QualifyingResult>(
    `/racing/qualifying-results/${id}/`,
  );
  return response.data;
}

export async function getSprintResults(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<SprintResult>>(
    "/racing/sprint-results/",
    { params },
  );

  return response.data;
}

export async function getSprintResult(id: string) {
  const response = await apiClient.get<SprintResult>(
    `/racing/sprint-results/${id}/`,
  );
  return response.data;
}
