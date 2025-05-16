"use server";
import { createClient } from "@/utils/supabase/server";

export async function getFormatHeaders(filters = {}) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_headers")
      .select("*, values:format_values(*)")
      .match(filters);
    if (error) {
      throw new Error(`Error al obtener los encabezados: ${error.message}`);
    }
    return { data, success: true };
  } catch (error) {
    console.error("Error al obtener los encabezados:", error);
    return { data: [], success: false };
  }
}

export async function getFormatHeaderById(id) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_headers")
      .select("*, values:format_values(*)")
      .eq("id", id);
    if (error) {
      throw new Error(
        `Error al obtener el encabezado con id ${id}: ${error.message}`
      );
    }
    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Encabezado con id ${id} no encontrado`,
      };
    }
    return { data: data[0], success: true };
  } catch (error) {
    console.error("Error al obtener el encabezado por id:", error);
    return { data: null, success: false };
  }
}

export async function createFormatHeader(header) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_headers")
      .insert(header)
      .select("*");
    if (error) {
      throw new Error(`Error al crear el encabezado: ${error.message}`);
    }
    return {
      data: data[0],
      success: true,
      message: "Encabezado creado exitosamente",
    };
  } catch (error) {
    console.error("Error al crear el encabezado:", error);
    return { data: null, success: false };
  }
}

export async function updateFormatHeader(id, header) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_headers")
      .update(header)
      .eq("id", id)
      .select("*");
    if (error) {
      throw new Error(
        `Error al actualizar el encabezado con id ${id}: ${error.message}`
      );
    }
    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Encabezado con id ${id} no encontrado`,
      };
    }
    return {
      data: data[0],
      success: true,
      message: "Encabezado actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error al actualizar el encabezado:", error);
    return { data: null, success: false };
  }
}

export async function deleteFormatHeader(id) {
  const supabase = await createClient();
  try {
    const { data: existingData, error: existingError } = await supabase
      .from("format_headers")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (existingError) {
      throw new Error(
        `Error al verificar existencia del encabezado: ${existingError.message}`
      );
    }
    if (!existingData) {
      return {
        success: false,
        message: `Encabezado con id ${id} no encontrado`,
      };
    }
    const { error } = await supabase
      .from("format_headers")
      .delete()
      .eq("id", id);
    if (error) {
      throw new Error(
        `Error al eliminar el encabezado con id ${id}: ${error.message}`
      );
    }
    return {
      success: true,
      message: "Encabezado eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error al eliminar el encabezado:", error);
    return { success: false, message: "Error al eliminar el encabezado" };
  }
}
