import { createClient } from "@/utils/supabase/server";

export async function getRoles(getAll = false) {
  const supabase = await createClient();

  try {
    // If getAll is true, select all roles
    // Otherwise, exclude super admin role
    let query = supabase.from("roles").select("*");

    if (getAll == "false") {
      query = query.not("role", "eq", "super admin");
    }

    const { data: roles, error } = await query;

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
