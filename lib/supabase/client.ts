import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";

let client: SupabaseClient | null = null;

/**
 * Cliente único, usado no navegador e no servidor (leituras públicas).
 * A sessão de login entra na Fase 6.
 */
export function supabase(): SupabaseClient {
  client ??= createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: typeof window !== "undefined" },
  });
  return client;
}
