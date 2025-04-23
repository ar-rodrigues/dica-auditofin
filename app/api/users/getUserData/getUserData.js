import { createClient } from "@/utils/supabase/server";

export async function getUserData() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (user) {
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select(
          `
          *,
          entity:entity (
            id,
            entity_name
          ),
          role:role (
            id,
            role
          )
        `
        )
        .eq("id", user.id);

      if (userData) {
        return userData;
      }

      return null;
    }

    if (error || !user) return null;

    return user;
  } catch (error) {
    console.error("Error fetching user session:", error);
    return null;
  }
}
