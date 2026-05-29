export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ListQueryParams = {
  search?: string;
  ordering?: string;
  [key: string]: string | number | boolean | undefined;
};
