"use server";
import { createClient } from "@/utils/supabase/server";

const PROFILE_TABLE = "profiles";

export async function getUsers(filters = {}) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from(PROFILE_TABLE)
      .select(
        `
        *,
        entity:entities(id, entity_name),
        role:roles(id, role, role_color)
      `
      )
      .match(filters);

    if (error) {
      throw new Error(`Error al obtener usuarios: ${error.message}`);
    }

    return { data, success: true };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: [], success: false };
  }
}

export async function getUserById(id) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from(PROFILE_TABLE)
      .select(
        "*, role:roles(id, role, role_color), entity:entities(id, entity_name)"
      )
      .eq("id", id);

    if (error) {
      throw new Error(`Error al obtener usuario: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Usuario con id ${id} no encontrado`,
      };
    }

    return { data: data[0], success: true };
  } catch (error) {
    console.error("Error fetching user by id:", error);
    return { data: null, success: false };
  }
}

export async function getUserByEmail(email) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from(PROFILE_TABLE)
      .select("*")
      .eq("email", email);

    if (error) {
      throw new Error(`Error al obtener usuario por email: ${error.message}`);
    }

    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Usuario con email ${email} no encontrado`,
      };
    }

    return { data: data[0], success: true };
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return { data: null, success: false };
  }
}

export async function createUser(newUser) {
  const supabase = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  );
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: newUser.email,
      password: newUser.password,
      email_confirm: true,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { data: data.user, success: true };
  } catch (error) {
    console.error("Error creating user:", error);
    return { data: null, success: false, message: error.message };
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
      })
      .select()
      .single();

    if (profileError) {
      throw new Error(`Error al crear perfil: ${profileError.message}`);
    }

    if (!profileData) {
      throw new Error(
        "No se recibieron datos del perfil después de la creación"
      );
    }

    return { data: profileData, success: true };
  } catch (error) {
    console.error("Error in createProfile:", error);
    return { data: null, success: false, message: error.message };
  }
}

export async function updateUser(id, data) {
  const supabase = await createClient();
  try {
    const { data: profileData, error: profileError } = await supabase
      .from(PROFILE_TABLE)
      .update(data)
      .eq("id", id)
      .select()
      .single();

    if (profileError) {
      throw new Error(`Error al actualizar usuario: ${profileError.message}`);
    }

    if (!profileData) {
      return {
        data: null,
        success: false,
        message: `Usuario con id ${id} no encontrado`,
      };
    }

    return { data: profileData, success: true };
  } catch (error) {
    console.error("Error updating user:", error);
    return { data: null, success: false, message: error.message };
  }
}

export async function deleteUser(id) {
  const supabase = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
  );
  try {
    const { data, error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      throw new Error(`Error al eliminar usuario: ${error.message}`);
    }

    return { data, success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { data: null, success: false, message: error.message };
  }
}

export async function deleteProfile(id) {
  const supabase = await createClient();
  try {
    const { data: profileData, error: profileError } = await supabase
      .from(PROFILE_TABLE)
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (profileError) {
      throw new Error(`Error al eliminar perfil: ${profileError.message}`);
    }

    if (!profileData) {
      return {
        data: null,
        success: false,
        message: `Perfil con id ${id} no encontrado`,
      };
    }

    return {
      data: profileData,
      success: true,
      message: "Perfil eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error in deleteProfile:", error);
    return { data: null, success: false, message: error.message };
  }
}
