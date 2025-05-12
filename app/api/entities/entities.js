"use server";
import { createClient } from "@/utils/supabase/server";

export async function getEntities() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from("entities").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching entities:", error);
    return [];
  }
}

export async function getEntityById(id) {
  const supabase = await createClient();
  try {
    const { data: entity, error } = await supabase
      .from("entities")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return entity;
  } catch (error) {
    console.error("Error fetching entity:", error);
    return [];
  }
}

export async function updateEntity(id, data) {
  const supabase = await createClient();
  try {
    const { data: updatedEntity, error } = await supabase
      .from("entities")
      .update(data)
      .eq("id", id)
      .select();
    if (error) throw error;

    return updatedEntity;
  } catch (error) {
    console.error("Error updating entity:", error);
    return [];
  }
}

export async function createEntity(data) {
  const supabase = await createClient();
  try {
    const { data: newEntity, error } = await supabase
      .from("entities")
      .insert(data)
      .select()
      .single();
    if (error) throw error;
    return newEntity;
  } catch (error) {
    console.error("Error creating entity:", error);
    return null;
  }
}

export async function deleteEntity(id) {
  const supabase = await createClient();
  try {
    // First check if there are any related areas
    const { data: areas, error: areasCheckError } = await supabase
      .from("entities_areas")
      .select("id")
      .eq("entity", id);

    if (areasCheckError) {
      console.error("Error checking related areas:", areasCheckError);
      throw new Error("Error al verificar las áreas asociadas");
    }

    if (areas && areas.length > 0) {
      return {
        success: false,
        error:
          "No se puede eliminar la entidad porque tiene áreas asociadas. Por favor, elimine las áreas primero.",
      };
    }

    // Then check if there are any related requirements
    const { data: requirements, error: requirementsCheckError } = await supabase
      .from("entities_requirements")
      .select("id")
      .eq("entity", id);

    if (requirementsCheckError) {
      console.error(
        "Error checking related requirements:",
        requirementsCheckError
      );
      throw new Error("Error al verificar los requerimientos asociados");
    }

    if (requirements && requirements.length > 0) {
      return {
        success: false,
        error:
          "No se puede eliminar la entidad porque tiene requerimientos asociados. Por favor, elimine los requerimientos primero.",
      };
    }

    // If no related records exist, proceed with entity deletion
    const { error: entityError } = await supabase
      .from("entities")
      .delete()
      .eq("id", id);

    if (entityError) {
      console.error("Error deleting entity:", entityError);
      throw new Error("Error al eliminar la entidad");
    }

    return { success: true };
  } catch (error) {
    console.error("Error in deleteEntity:", error);
    return {
      success: false,
      error: error.message || "Error al eliminar la entidad",
    };
  }
}
