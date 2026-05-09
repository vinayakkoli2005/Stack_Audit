import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Returns null when env vars are not configured — routes degrade gracefully
export function getSupabaseClient() {
  if (!url || !key) return null;
  return createClient(url, key);
}
