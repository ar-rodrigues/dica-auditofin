"use server";
import { createClient } from "@/utils/supabase/server";

export async function getEntitiesFormats(filters = {}) {
  const supabase = await createClient();
  try {
    // Extract auditor_user_id from filters, keep the rest for match()
    const { auditor_user_id, ...matchFilters } = filters;

    // Execute the Supabase query with the remaining filters
    const { data, error } = await supabase
      .from("entities_formats")
      .select(
        `*, 
        entity:entities(*), 
        format:formats(*, created_by(id, role, first_name, last_name, email), headers:format_headers(id, header, type, order)), 
        area:entities_areas(*, predecessor:predecessor(id, first_name, last_name, email), successor:successor(id, first_name, last_name, email)), 
        auditor:auditors_for_entities(*, auditor: profiles(id, first_name, last_name, email)),
        format_entries:format_entries(*),
        values:format_values(id, cell_ref, value, header_id(id, header, type, order))`
      )
      .match(matchFilters);

    if (error) {
      throw new Error(
        `Error al obtener los formatos de entidades: ${error.message}`
      );
    }

    // If auditor_user_id is provided, filter the results
    let filteredData = data;
    if (auditor_user_id) {
      filteredData = data.filter(
        (format) => format.auditor?.auditor?.id === auditor_user_id
      );
    }

    return { data: filteredData, success: true };
  } catch (error) {
    console.error("Error al obtener los formatos de entidades:", error);
    return { data: [], success: false };
  }
}

export async function getEntityFormatById(id) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("entities_formats")
      .select(
        `*, 
        entity:entities(*), 
        format:formats(*, created_by(id, role, first_name, last_name, email), headers:format_headers(id, header, type, order)), 
        area:entities_areas(*, predecessor:predecessor(id, first_name, last_name, email), successor:successor(id, first_name, last_name, email)), 
        auditor:auditors_for_entities(*, auditor: profiles(id, first_name, last_name, email)),
        format_entries:format_entries(*, modified_by(id, role, first_name, last_name, email), reviewed_by(auditor(id, first_name, last_name, email))),
        values:format_values(id,cell_ref, value, header_id(id, header, type, order))`
      )
      .eq("id", id);

    if (error) {
      throw new Error(
        `Error al obtener el formato de entidad con id ${id}: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Formato de entidad con id ${id} no encontrado`,
      };
    }

    return { data: data[0], success: true };
  } catch (error) {
    console.error("Error al obtener el formato de entidad por id:", error);
    return { data: null, success: false };
  }
}

export async function createEntityFormat(entityFormat) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("entities_formats")
      .insert(entityFormat)
      .select("*");

    if (error) {
      throw new Error(`Error al crear el formato de entidad: ${error.message}`);
    }

    return {
      data: data[0],
      success: true,
      message: "Formato de entidad creado exitosamente",
    };
  } catch (error) {
    console.error("Error al crear el formato de entidad:", error);
    return { data: null, success: false };
  }
}

export async function updateEntityFormat(id, entityFormat) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("entities_formats")
      .update(entityFormat)
      .eq("id", id)
      .select("*");

    if (error) {
      throw new Error(
        `Error al actualizar el formato de entidad con id ${id}: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Formato de entidad con id ${id} no encontrado`,
      };
    }

    return {
      data: data[0],
      success: true,
      message: "Formato de entidad actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error al actualizar el formato de entidad:", error);
    return { data: null, success: false };
  }
}

export async function deleteEntityFormat(id) {
  const supabase = await createClient();
  try {
    // Check if entity format exists before deleting
    const { data: existingData, error: existingError } = await supabase
      .from("entities_formats")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existingError) {
      throw new Error(
        `Error al verificar la existencia del formato de entidad: ${existingError.message}`
      );
    }

    if (!existingData) {
      return {
        success: false,
        message: `Formato de entidad con id ${id} no encontrado`,
      };
    }

    const { error } = await supabase
      .from("entities_formats")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(
        `Error al eliminar el formato de entidad con id ${id}: ${error.message}`
      );
    }

    return {
      success: true,
      message: "Formato de entidad eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error al eliminar el formato de entidad:", error);
    return {
      success: false,
      message: "Error al eliminar el formato de entidad",
    };
  }
}
