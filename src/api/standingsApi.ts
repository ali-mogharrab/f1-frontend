import { apiClient } from "./client";
import type { ListQueryParams, PaginatedResponse } from "../types/api";
import type {
  ConstructorStanding,
  DriverStanding,
} from "../types/standings";

export async function getDriverStandings(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<DriverStanding>>(
    "/standings/drivers/",
    { params },
  );

  return response.data;
}

export async function getDriverStanding(id: string) {
  const response = await apiClient.get<DriverStanding>(
    `/standings/drivers/${id}/`,
  );
  return response.data;
}

export async function getConstructorStandings(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<ConstructorStanding>>(
    "/standings/constructors/",
    { params },
  );

  return response.data;
}

export async function getConstructorStanding(id: string) {
  const response = await apiClient.get<ConstructorStanding>(
    `/standings/constructors/${id}/`,
  );
  return response.data;
}
