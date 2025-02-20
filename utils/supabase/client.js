import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
  } else if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
