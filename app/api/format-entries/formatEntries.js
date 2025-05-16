"use server";
import { createClient } from "@/utils/supabase/server";

export async function getFormatEntries(filters = {}) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_entries")
      .select("*, values:format_values(*)")
      .match(filters);
    if (error) {
      throw new Error(`Error al obtener las entradas: ${error.message}`);
    }
    return { data, success: true };
  } catch (error) {
    console.error("Error al obtener las entradas:", error);
    return { data: [], success: false };
  }
}

export async function getFormatEntryById(id) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_entries")
      .select("*, values:format_values(*)")
      .eq("id", id);
    if (error) {
      throw new Error(
        `Error al obtener la entrada con id ${id}: ${error.message}`
      );
    }
    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Entrada con id ${id} no encontrada`,
      };
    }
    return { data: data[0], success: true };
  } catch (error) {
    console.error("Error al obtener la entrada por id:", error);
    return { data: null, success: false };
  }
}

export async function createFormatEntry(entry) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_entries")
      .insert(entry)
      .select("*");
    if (error) {
      throw new Error(`Error al crear la entrada: ${error.message}`);
    }
    return {
      data: data[0],
      success: true,
      message: "Entrada creada exitosamente",
    };
  } catch (error) {
    console.error("Error al crear la entrada:", error);
    return { data: null, success: false };
  }
}

export async function updateFormatEntry(id, entry) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_entries")
      .update(entry)
      .eq("id", id)
      .select("*");
    if (error) {
      throw new Error(
        `Error al actualizar la entrada con id ${id}: ${error.message}`
      );
    }
    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Entrada con id ${id} no encontrada`,
      };
    }
    return {
      data: data[0],
      success: true,
      message: "Entrada actualizada exitosamente",
    };
  } catch (error) {
    console.error("Error al actualizar la entrada:", error);
    return { data: null, success: false };
  }
}

export async function deleteFormatEntry(id) {
  const supabase = await createClient();
  try {
    const { data: existingData, error: existingError } = await supabase
      .from("format_entries")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (existingError) {
      throw new Error(
        `Error al verificar existencia de la entrada: ${existingError.message}`
      );
    }
    if (!existingData) {
      return {
        success: false,
        message: `Entrada con id ${id} no encontrada`,
      };
    }
    const { error } = await supabase
      .from("format_entries")
      .delete()
      .eq("id", id);
    if (error) {
      throw new Error(
        `Error al eliminar la entrada con id ${id}: ${error.message}`
      );
    }
    return {
      success: true,
      message: "Entrada eliminada exitosamente",
    };
  } catch (error) {
    console.error("Error al eliminar la entrada:", error);
    return { success: false, message: "Error al eliminar la entrada" };
  }
}

export async function getFormatEntriesExcel(format_id) {
  const supabase = await createClient();
  try {
    // Obtener headers del formato
    const { data: headers, error: headersError } = await supabase
      .from("format_headers")
      .select("id, header, type, order")
      .eq("format_id", format_id)
      .order("order", { ascending: true });
    if (headersError)
      throw new Error(
        `Error al obtener los encabezados: ${headersError.message}`
      );
    // Obtener todas las entradas para el formato
    const { data: entries, error: entriesError } = await supabase
      .from("format_entries")
      .select("id, filled_by, created_at")
      .eq("format_id", format_id);
    if (entriesError)
      throw new Error(`Error al obtener las entradas: ${entriesError.message}`);
    // Obtener todos los valores para las entradas
    const entryIds = entries.map((e) => e.id);
    let values = [];
    if (entryIds.length > 0) {
      const { data: valuesData, error: valuesError } = await supabase
        .from("format_values")
        .select("entry_id, header_id, value")
        .in("entry_id", entryIds);
      if (valuesError)
        throw new Error(`Error al obtener los valores: ${valuesError.message}`);
      values = valuesData;
    }
    // Construir estructura tipo Excel
    const headerMap = Object.fromEntries(headers.map((h) => [h.id, h.header]));
    const rows = entries.map((entry) => {
      const row = {
        id: entry.id,
        filled_by: entry.filled_by,
        created_at: entry.created_at,
      };
      headers.forEach((h) => {
        const val = values.find(
          (v) => v.entry_id === entry.id && v.header_id === h.id
        );
        row[headerMap[h.id]] = val ? val.value : null;
      });
      return row;
    });
    return { data: rows, headers, success: true };
  } catch (error) {
    console.error("Error al obtener datos tipo Excel:", error);
    return { data: [], headers: [], success: false, message: error.message };
  }
}
