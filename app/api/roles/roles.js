import { createClient } from "@/utils/supabase/server";

export async function getRoles() {
  const supabase = await createClient();
  try {
    const { data: roles, error } = await supabase.from("roles").select("*");
    if (error) throw error;
    return roles;
  } catch (error) {
    console.error("Error fetching roles:", error);
    return [];
  }
}

export async function getRoleById(id) {
  const supabase = await createClient();
  try {
    const { data: role, error } = await supabase
      .from("roles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return role;
  } catch (error) {
    console.error("Error fetching role:", error);
    return [];
  }
}
