import { createClient } from "@supabase/supabase-js";

// IMPORTANT: Never import this file in a Client Component.
// SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix — Next.js excludes it
// from the client bundle. But the import itself should stay in Route Handlers
// and Server Components only. The 'server-only' package is not installed in
// this project — convention enforces this boundary.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
