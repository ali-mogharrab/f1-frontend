import { apiClient } from "./client";
import type { ListQueryParams, PaginatedResponse } from "../types/api";
import type { Article, Category, Tag } from "../types/content";

export async function getCategories(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<Category>>(
    "/content/categories/",
    { params },
  );

  return response.data;
}

export async function getCategory(id: string) {
  const response = await apiClient.get<Category>(`/content/categories/${id}/`);
  return response.data;
}

export async function getTags(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<Tag>>(
    "/content/tags/",
    { params },
  );

  return response.data;
}

export async function getTag(id: string) {
  const response = await apiClient.get<Tag>(`/content/tags/${id}/`);
  return response.data;
}

export async function getArticles(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<Article>>(
    "/content/articles/",
    { params },
  );

  return response.data;
}

export async function getFeaturedArticles(params?: ListQueryParams) {
  const response = await apiClient.get<PaginatedResponse<Article>>(
    "/content/articles/featured/",
    { params },
  );

  return response.data;
}

export async function getArticle(id: string) {
  const response = await apiClient.get<Article>(`/content/articles/${id}/`);
  return response.data;
}

export async function getArticleBySlug(slug: string) {
  const response = await apiClient.get<Article>(
    `/content/articles/slug/${slug}/`,
  );

  return response.data;
}
