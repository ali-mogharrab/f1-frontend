export type Tag = {
  id: string;
  name: string;
  slug: string;
  articles_count?: number;
  created_at: string;
  updated_at: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  content: string;
  cover_image: string | null;
  category: string | null;
  category_name: string | null;
  category_slug: string | null;
  tags: Tag[];
  author: string | null;
  author_username: string | null;
  related_race: string | null;
  related_race_name: string | null;
  related_driver: string | null;
  related_driver_name: string | null;
  related_team: string | null;
  related_team_name: string | null;
  status: string;
  is_featured: boolean;
  published_at: string | null;
  views_count: number;
  created_at: string;
  updated_at: string;
};