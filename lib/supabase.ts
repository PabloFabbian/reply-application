import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;

    if (!url || !key) {
        throw new Error("Faltan SUPABASE_URL o SUPABASE_SECRET_KEY. Revisá .env.local.");
    }

    return createClient(url, key, { auth: { persistSession: false } });
}