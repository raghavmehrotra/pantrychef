import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? "";
const url = rawUrl.startsWith("https://") ? rawUrl : `https://${rawUrl}`;

/**
 * Creates a Supabase client authenticated with the current Clerk user's JWT.
 * This allows RLS policies using auth.uid() to work with Clerk.
 * Must be called from server-side code (API routes).
 */
export async function createAuthenticatedClient() {
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });

  return createClient(url, key, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
