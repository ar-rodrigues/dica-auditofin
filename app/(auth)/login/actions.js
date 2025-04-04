"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
const { headers } = require("next/headers");

export async function login(formData) {
  try {
    const supabase = await createClient();

    // Validate inputs
    if (!formData.email || !formData.password) {
      throw new Error("Email and password are required");
    }

    const data = {
      email: formData.email,
      password: formData.password,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      // Handle specific error cases
      switch (error.message) {
        case "Invalid login credentials":
          return {
            success: false,
            error: "Email o contraseña incorrectos",
          };
        case "Email not confirmed":
          return {
            success: false,
            error: "Por favor confirma tu email antes de iniciar sesión",
          };
        default:
          return {
            success: false,
            error: "Error al iniciar sesión. Por favor intenta de nuevo.",
          };
      }
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Ocurrió un error inesperado. Por favor intenta de nuevo.",
    };
  }
}

export async function signup(formData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPassword(userEmail, baseUrl) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
    redirectTo: `${baseUrl}/auth/reset`,
  });

  if (error) {
    return { success: false, error };
  }

  return { success: true };
}
