import { createClient } from "@/utils/supabase/server";

export async function getUserData() {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        data: null,
        success: false,
        message: "Error al obtener el usuario autenticado",
      };
    }

    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select(
        `
        *,
        entity:entities (
          *
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
      return {
        data: null,
        success: false,
        message: "Error al obtener el perfil del usuario",
      };
    }

    return {
      data: userData,
      success: true,
      message: "Datos del usuario obtenidos exitosamente",
    };
  } catch (error) {
    console.error("Error en getUserData:", error);
    return {
      data: null,
      success: false,
      message: "Error al obtener los datos del usuario",
    };
  }
}
