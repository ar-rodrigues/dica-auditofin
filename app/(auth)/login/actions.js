"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
const { headers } = require("next/headers");

export async function login(formData) {
  const supabase = await createClient();

  //console.log(formData);

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error);
    return { success: false, error };
  }
  revalidatePath("/", "layout");
  return { success: true };
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
