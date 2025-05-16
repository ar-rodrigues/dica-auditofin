"use server";
import { createClient } from "@/utils/supabase/server";

export async function getFormats(filters = {}) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("formats")
      .select("*, headers:format_headers(*)")
      .match(filters);
    if (error) {
      throw new Error(`Error al obtener los formatos: ${error.message}`);
    }
    return { data, success: true };
  } catch (error) {
    console.error("Error al obtener los formatos:", error);
    return { data: [], success: false };
  }
}

export async function getFormatById(id) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("formats")
      .select("*, headers:format_headers(*)")
      .eq("id", id);
    if (error) {
      throw new Error(
        `Error al obtener el formato con id ${id}: ${error.message}`
      );
    }
    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Formato con id ${id} no encontrado`,
      };
    }
    return { data: data[0], success: true };
  } catch (error) {
    console.error("Error al obtener el formato por id:", error);
    return { data: null, success: false };
  }
}

export async function createFormat(format) {
  const supabase = await createClient();
  try {
    // 1. Insertar el formato (sin headers)
    const { name, created_by, headers } = format;
    const { data: formatData, error: formatError } = await supabase
      .from("formats")
      .insert({ name, created_by })
      .select("*")
      .single();
    if (formatError) {
      throw new Error(`Error al crear el formato: ${formatError.message}`);
    }
    // 2. Insertar los encabezados en format_headers
    let headersData = [];
    if (headers && headers.length > 0) {
      const headersToInsert = headers.map((h, idx) => ({
        format_id: formatData.id,
        header: h.header,
        type: h.type,
        order: h.order ?? idx,
      }));
      const { data: insertedHeaders, error: headersError } = await supabase
        .from("format_headers")
        .insert(headersToInsert)
        .select("*");
      if (headersError) {
        throw new Error(
          `Error al crear los encabezados: ${headersError.message}`
        );
      }
      headersData = insertedHeaders;
    }
    return {
      data: { ...formatData, headers: headersData },
      success: true,
      message: "Formato y encabezados creados exitosamente",
    };
  } catch (error) {
    console.error("Error al crear el formato:", error);
    return { data: null, success: false, message: error.message };
  }
}

export async function updateFormat(id, format) {
  const supabase = await createClient();
  try {
    // Remove headers before updating the format
    const { headers, ...formatData } = format;
    // 1. Update the format itself
    const { data, error } = await supabase
      .from("formats")
      .update(formatData)
      .eq("id", id)
      .select("*");
    if (error) {
      throw new Error(
        `Error al actualizar el formato con id ${id}: ${error.message}`
      );
    }
    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Formato con id ${id} no encontrado`,
      };
    }
    // 2. Update headers
    // Fetch current headers from DB
    const { data: currentHeaders, error: fetchHeadersError } = await supabase
      .from("format_headers")
      .select("id")
      .eq("format_id", id);
    if (fetchHeadersError) {
      throw new Error(
        `Error al obtener encabezados: ${fetchHeadersError.message}`
      );
    }
    const currentHeaderIds = (currentHeaders || []).map((h) => h.id);
    const sentHeaderIds = (headers || []).filter((h) => h.id).map((h) => h.id);
    // Headers to delete: in DB but not in request
    const headersToDelete = currentHeaderIds.filter(
      (id) => !sentHeaderIds.includes(id)
    );
    if (headersToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from("format_headers")
        .delete()
        .in("id", headersToDelete);
      if (deleteError) {
        throw new Error(
          `Error al eliminar encabezados: ${deleteError.message}`
        );
      }
    }
    // Update or insert headers
    for (const [idx, h] of (headers || []).entries()) {
      if (h.id) {
        // Update existing
        const { error: updateHeaderError } = await supabase
          .from("format_headers")
          .update({
            header: h.header,
            type: h.type,
            order: h.order ?? idx,
          })
          .eq("id", h.id);
        if (updateHeaderError) {
          throw new Error(
            `Error al actualizar encabezado: ${updateHeaderError.message}`
          );
        }
      } else {
        // Insert new
        const { error: insertHeaderError } = await supabase
          .from("format_headers")
          .insert({
            format_id: id,
            header: h.header,
            type: h.type,
            order: h.order ?? idx,
          });
        if (insertHeaderError) {
          throw new Error(
            `Error al crear encabezado: ${insertHeaderError.message}`
          );
        }
      }
    }
    return {
      data: data[0],
      success: true,
      message: "Formato y encabezados actualizados exitosamente",
    };
  } catch (error) {
    console.error("Error al actualizar el formato:", error);
    return { data: null, success: false, message: error.message };
  }
}

export async function deleteFormat(id) {
  const supabase = await createClient();
  try {
    const { data: existingData, error: existingError } = await supabase
      .from("formats")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (existingError) {
      throw new Error(
        `Error al verificar existencia del formato: ${existingError.message}`
      );
    }
    if (!existingData) {
      return {
        success: false,
        message: `Formato con id ${id} no encontrado`,
      };
    }
    const { error } = await supabase.from("formats").delete().eq("id", id);
    if (error) {
      throw new Error(
        `Error al eliminar el formato con id ${id}: ${error.message}`
      );
    }
    return {
      success: true,
      message: "Formato eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error al eliminar el formato:", error);
    return { success: false, message: "Error al eliminar el formato" };
  }
}
