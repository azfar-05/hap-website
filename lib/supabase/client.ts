import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// @supabase/ssr@0.5.2 passes Schema as the 3rd arg to SupabaseClient, but that
// slot is SchemaName (a string), so Schema defaults to never and write ops break.
// Cast to the correct 4-arg form to fix type resolution for write operations.
type TypedClient = SupabaseClient<Database, "public", "public", Database["public"]>;

export function createClient(): TypedClient {
  // isSingleton: false — the module-level cache would reuse a pre-login client
  // (null session) after a client-side redirect from the login Server Action.
  // We manage the singleton ourselves via useRef in each component instead.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { isSingleton: false }
  ) as unknown as TypedClient;
}
