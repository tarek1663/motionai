import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL manquant — renseigne-le dans .env.local (voir .env)"
  );
}
if (!supabaseServiceKey) {
  throw new Error(
    "SUPABASE_SERVICE_KEY manquant — Supabase → Project Settings → API → service_role secret"
  );
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
