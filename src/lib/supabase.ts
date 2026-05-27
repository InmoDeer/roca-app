import { getSupabaseClient } from "@/core/services/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_client) _client = getSupabaseClient();
    return (_client as any)[prop];
  },
});
