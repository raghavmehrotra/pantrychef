import { createClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? "";

const url = rawUrl.startsWith("https://") ? rawUrl : `https://${rawUrl}`;

export const supabase = createClient(url, key);
