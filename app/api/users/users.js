"use server";
import { createClient } from "@/utils/supabase/server";

const PROFILE_TABLE = "profiles";

export async function getUsers() {
  const supabase = await createClient();
  const { data: profilesData, error } = await supabase.from(PROFILE_TABLE)
    .select(`
      *,
      entity:entities(entity_name),
      role:roles(role, role_color)
    `);
  //console.log(profilesData);
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return profilesData || [];
}

export async function getUserById(id) {
  const supabase = await createClient();
  //console.log(id);
  const { data: profileData, error } = await supabase
    .from(PROFILE_TABLE)
    .select("*, role:roles(role, role_color), entity:entities(entity_name)")
    .eq("id", id);
  //console.log("profileData", profileData);
  return profileData;
}

export async function getUserByEmail(email) {
  const supabase = createClient();
  const { data: profileData, error } = await supabase
    .from(PROFILE_TABLE)
    .select("*")
    .eq("email", email);
  return profileData;
}

export async function createUser(user) {
  const supabase = createClient();
  try {
    const { data: newUser, error: signUpError } = (await supabase).auth.signUp({
      email: user.email,
      password: user.password,
    });
    // once the user is created, insert the user into profiles table
    if (newUser.user) {
      const { data: profileData, error: profileError } = await supabase
        .from(PROFILE_TABLE)
        .insert({
          id: newUser.user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          photo: user.photo,
          role: user.role,
          entity: user.entity,
          is_active: user.is_active,
          updated_at: user.updated_at,
        });
      return profileData;
    } else {
      throw new Error("User not created");
    }
  } catch (error) {
    console.error(error);
  }
}
