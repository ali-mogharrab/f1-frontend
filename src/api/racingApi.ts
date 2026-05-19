import { apiClient } from "./client";
import type { PaginatedResponse } from "../types/api";
import type { Driver } from "../types/racing";

export async function getDrivers() {
  const response = await apiClient.get<PaginatedResponse<Driver>>(
    "/racing/drivers/",
  );

  return response.data;
}