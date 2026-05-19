export type TokenPair = {
  access: string;
  refresh: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type UserProfile = {
  id: string;
  bio: string;
  avatar: string | null;
  country: string;
  favorite_driver_name: string;
  favorite_team_name: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_staff: boolean;
  date_joined: string;
  profile: UserProfile;
};

export type SuccessResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};