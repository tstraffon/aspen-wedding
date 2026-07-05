import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// IMPORTANT: Never import this file in a Client Component.
// SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix — Next.js excludes it
// from the client bundle. Keep this import in Route Handlers and Server
// Components only. The 'server-only' package is not installed in this project —
// convention enforces this boundary.

// The client is created lazily (on first use), NOT at module load. Next.js
// "collect page data" evaluates every route module during the build, where
// SUPABASE_SERVICE_ROLE_KEY is absent — a top-level createClient(url, undefined)
// throws "supabaseKey is required" and fails the Vercel build. Deferring
// creation to the first property access keeps the build env-free; the env is
// only required at request time.
let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (client) return client;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase admin environment variables are not configured");
  }
  client = createClient(supabaseUrl, serviceRoleKey);
  return client;
}

// Proxy preserves every existing `supabaseAdmin.from(...)` call site unchanged
// while routing the first property access through getClient().
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const c = getClient() as unknown as Record<string | symbol, unknown>;
    const value = c[prop];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(c)
      : value;
  },
});
