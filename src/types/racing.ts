export type Driver = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  abbreviation: string;
  number: number | null;
  country: string;
  date_of_birth: string | null;
  place_of_birth: string;
  status: string;
  current_team: string | null;
  current_team_name: string | null;
  image: string | null;
  biography: string;
  created_at: string;
  updated_at: string;
};

export type Team = {
  id: string;
  name: string;
  official_name: string;
  country: string;
  base_location: string;
  team_principal: string;
  technical_chief: string;
  chassis: string;
  power_unit: string;
  first_team_entry: number | null;
  world_championships: number;
  website: string;
  logo: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Race = {
  id: string;
  season: string;
  season_year: number;
  circuit: string;
  circuit_name: string;
  circuit_country: string;
  name: string;
  official_name: string;
  round_number: number;
  race_date: string;
  race_time: string | null;
  qualifying_date: string | null;
  qualifying_time: string | null;
  sprint_date: string | null;
  sprint_time: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};