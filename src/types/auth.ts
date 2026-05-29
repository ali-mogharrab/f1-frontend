export type TokenPair = {
  access: string;
  refresh: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
};

export type VerifyTokenPayload = {
  token: string;
};

export type ChangePasswordPayload = {
  old_password: string;
  new_password: string;
  new_password_confirm: string;
};

export type PasswordResetRequestPayload = {
  email: string;
};

export type PasswordResetConfirmPayload = {
  uid: string;
  token: string;
  new_password: string;
  new_password_confirm: string;
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

export type FavoriteDriver = {
  id: string;
  driver: string;
  driver_name: string;
  driver_abbreviation: string;
  driver_country: string;
  current_team_name: string | null;
  created_at: string;
};

export type FavoriteTeam = {
  id: string;
  team: string;
  team_name: string;
  team_country: string;
  team_logo: string | null;
  created_at: string;
};

export type FavoriteRace = {
  id: string;
  race: string;
  race_name: string;
  season_year: number;
  round_number: number;
  circuit_name: string;
  race_date: string;
  created_at: string;
};

export type UserDashboard = {
  user: User;
  favorites_summary: {
    drivers_count: number;
    teams_count: number;
    races_count: number;
  };
  recent_favorite_drivers: FavoriteDriver[];
  recent_favorite_teams: FavoriteTeam[];
  recent_favorite_races: FavoriteRace[];
};
