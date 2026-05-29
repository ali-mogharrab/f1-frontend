export type Season = {
  id: string;
  year: number;
  name: string;
  is_current: boolean;
  created_at: string;
  updated_at: string;
};

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

export type Circuit = {
  id: string;
  name: string;
  official_name: string;
  country: string;
  city: string;
  length_km: string | null;
  number_of_laps: number | null;
  race_distance_km: string | null;
  lap_record: string;
  lap_record_driver: string;
  lap_record_year: number | null;
  latitude: string | null;
  longitude: string | null;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type RaceResult = {
  id: string;
  race: string;
  race_name: string;
  season_year: number;
  round_number: number;
  driver: string;
  driver_name: string;
  driver_abbreviation: string;
  team: string;
  team_name: string;
  position: number;
  classified_position: string;
  grid_position: number | null;
  laps_completed: number;
  time: string;
  fastest_lap: boolean;
  fastest_lap_time: string;
  fastest_lap_rank: number | null;
  points: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type QualifyingResult = {
  id: string;
  race: string;
  race_name: string;
  season_year: number;
  round_number: number;
  driver: string;
  driver_name: string;
  driver_abbreviation: string;
  team: string;
  team_name: string;
  position: number;
  q1_time: string;
  q2_time: string;
  q3_time: string;
  laps_completed: number;
  penalty: string;
  created_at: string;
  updated_at: string;
};

export type SprintResult = {
  id: string;
  race: string;
  race_name: string;
  season_year: number;
  round_number: number;
  driver: string;
  driver_name: string;
  driver_abbreviation: string;
  team: string;
  team_name: string;
  position: number;
  grid_position: number | null;
  laps_completed: number;
  time: string;
  points: string;
  status: string;
  created_at: string;
  updated_at: string;
};
