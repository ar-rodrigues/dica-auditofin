import { createClient } from "@/utils/supabase/server";
import { getUserById } from "../users";

export async function getUserRole() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) return null;

    const userRole = await getUserById(user.id);
    return userRole?.[0]?.role ?? null;
  } catch (error) {
    console.error("getUserRole error:", error);
    return null;
  }
}
