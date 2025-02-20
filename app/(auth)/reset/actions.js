"use server";

import { createClient } from "@/utils/supabase/server";

export async function newPassword({ password, code }) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, authError };
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    return { success: false, error };
  }
  return { success: true };
}
