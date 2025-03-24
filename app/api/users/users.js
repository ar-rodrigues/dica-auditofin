"use server";
import { createClient } from "@/utils/supabase/server";

const PROFILE_TABLE = "profiles";

export async function getUsers() {
  const supabase = await createClient();
  const { data: profilesData, error } = await supabase.from(PROFILE_TABLE)
    .select(`
      *,
      entity:entities(id, entity_name),
      role:roles(id, role, role_color)
    `);
  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return profilesData || [];
}

export async function getUserById(id) {
  const supabase = await createClient();

  const { data: profileData, error } = await supabase
    .from(PROFILE_TABLE)
    .select(
      "*, role:roles(id, role, role_color), entity:entities(id, entity_name)"
    )
    .eq("id", id);

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

export async function createUser(newUser) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    const user = data.user;

    return user;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

export async function createProfile(user, newUser) {
  const supabase = await createClient();

  try {
    const { data: profileData, error: profileError } = await supabase
      .from(PROFILE_TABLE)
      .insert({
        id: user.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        photo: newUser.photo,
        role: newUser.role,
        entity: newUser.entity,
        is_active: newUser.is_active,
        created_at: user.created_at,
        last_change: user.updated_at,
      });

    return profileData;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

export async function updateUser(id, data) {
  const supabase = await createClient();

  try {
    const { data: profileData, error: profileError } = await supabase
      .from(PROFILE_TABLE)
      .update(data)
      .eq("id", id);

    return profileData;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteUser(id) {
  const supabase = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data, error } = await supabase.auth.admin.deleteUser(id);

    return data;
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

export async function deleteProfile(id) {
  const supabase = await createClient();

  try {
    const { data: profileData, error: profileError } = await supabase
      .from(PROFILE_TABLE)
      .delete()
      .eq("id", id);

    if (profileError) {
      console.error(profileError);
      throw new Error(profileError.message);
    }

    return {
      success: true,
      message: "Profile deleted successfully",
      profileData,
    };
  } catch (error) {
    console.error(error);
  }
}
