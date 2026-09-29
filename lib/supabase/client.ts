import { createBrowserClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./config";

let browserClient: SupabaseClient | null = null;
let publicServerClient: SupabaseClient | null = null;

/**
 * No navegador: cliente com a sessão do usuário (cookies, renovação automática).
 * No servidor: cliente anônimo, só para leituras públicas (metadados, build).
 */
export function supabase(): SupabaseClient {
  if (typeof window !== "undefined") {
    browserClient ??= createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
    return browserClient;
  }
  publicServerClient ??= createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return publicServerClient;
}
