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

// Wrapper para manejar errores de red en llamadas a Supabase desde el cliente
export async function withSupabaseClientErrorHandling(callback) {
  try {
    return await callback();
  } catch (error) {
    if (error.message && error.message.includes("Failed to fetch")) {
      return {
        data: null,
        error: {
          message: "Sin conexión a internet. Por favor, verifica tu conexión.",
        },
      };
    }
    return {
      data: null,
      error: { message: error.message || "Error desconocido." },
    };
  }
}
