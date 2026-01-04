export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  birth_date?: string | null;
  sex?: string | null;
  height?: number | null;
  is_active: boolean;
}

export interface UserUpdate {
  full_name?: string | null;
  birth_date?: string | null;
  sex?: string | null;
  height?: number | null;
  email?: string;
  password?: string;
}

export interface BodyMetric {
  id: string;
  user_id: string;
  date: string;
  weight: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  water_percentage?: number;
  bmi?: number;
  ffmi?: number;
  bmr?: number;
  notes?: string;
}

export interface BodyMetricCreate {
  date: string;
  weight: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  water_percentage?: number;
  bmi?: number;
  ffmi?: number;
  bmr?: number;
  notes?: string;
}

export interface BodyMetricUpdate {
  date?: string;
  weight?: number;
  body_fat_percentage?: number;
  muscle_mass?: number;
  water_percentage?: number;
  bmi?: number;
  ffmi?: number;
  bmr?: number;
  notes?: string;
}
