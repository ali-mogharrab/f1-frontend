import { apiClient } from "./client";
import type { PaginatedResponse } from "../types/api";
import type {
  ConstructorStanding,
  DriverStanding,
} from "../types/standings";

export async function getDriverStandings() {
  const response = await apiClient.get<PaginatedResponse<DriverStanding>>(
    "/standings/drivers/",
  );

  return response.data;
}

export async function getConstructorStandings() {
  const response = await apiClient.get<PaginatedResponse<ConstructorStanding>>(
    "/standings/constructors/",
  );

  return response.data;
}