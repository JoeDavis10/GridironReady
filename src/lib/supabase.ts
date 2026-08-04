import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

/** True when public Supabase env is present (roster cloud + Google auth). */
export const supabaseConfigured = Boolean(
  supabaseUrl?.trim() && supabaseAnonKey?.trim(),
);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!supabaseConfigured) return null;
  if (!client) {
    client = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }
  return client;
}

/** DB row shapes (snake_case) matching the Gridiron Ready Supabase schema. */
export type PlayerRow = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  number: string | null;
  grade_or_year: string | null;
  listed_position: string | null;
  target_positions: string[] | null;
  traits: Record<string, number>;
  measurables: Record<string, number>;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type EvalLogRow = {
  id: string;
  user_id: string;
  player_id: string;
  drill_id: string;
  score: number;
  note: string | null;
  at: string;
};
