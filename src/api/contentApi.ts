import { apiClient } from "./client";
import type { PaginatedResponse } from "../types/api";
import type { Article } from "../types/content";

export async function getArticles() {
  const response = await apiClient.get<PaginatedResponse<Article>>(
    "/content/articles/",
  );

  return response.data;
}

export async function getFeaturedArticles() {
  const response = await apiClient.get<PaginatedResponse<Article>>(
    "/content/articles/featured/",
  );

  return response.data;
}

export async function getArticleBySlug(slug: string) {
  const response = await apiClient.get<Article>(
    `/content/articles/slug/${slug}/`,
  );

  return response.data;
}