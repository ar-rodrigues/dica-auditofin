import { createClient } from "@/utils/supabase/server";

export async function getUserData() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error("Error getting user:", error);
      return null;
    }

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select(
        `
        *,
        entity:entities (
          id,
          entity_name
        ),
        role:roles (
          id,
          role
        )
      `
      )
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("Error fetching user profile:", userError);
      return null;
    }

    return userData;
  } catch (error) {
    console.error("Error in getUserData:", error);
    return null;
  }
}
