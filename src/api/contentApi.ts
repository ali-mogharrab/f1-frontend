import { apiClient } from "./client";
import type { PaginatedResponse } from "../types/api";
import type { Article } from "../types/content";

export async function getFeaturedArticles() {
  const response = await apiClient.get<PaginatedResponse<Article>>(
    "/content/articles/featured/",
  );

  return response.data;
}