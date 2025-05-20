import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient(serviceRoleKey) {
  const cookieStore = await cookies();

  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined");
  } else if (process.env.NEXT_PUBLIC_SUPABASE_URL === undefined) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Wrapper para manejar errores de red en llamadas a Supabase desde el servidor
export async function withSupabaseServerErrorHandling(callback) {
  try {
    return await callback();
  } catch (error) {
    if (error.message && error.message.includes("Failed to fetch")) {
      return {
        data: null,
        error: {
          message:
            "Sin conexión a internet. Por favor, verifica tu conexión (servidor).",
        },
      };
    }
    return {
      data: null,
      error: { message: error.message || "Error desconocido (servidor)." },
    };
  }
}
