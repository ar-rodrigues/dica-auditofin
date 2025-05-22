"use server";
import { createClient } from "@/utils/supabase/server";

export async function getFormatEntries(filters = {}) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_entries")
      .select(
        `*,
        entities_formats_id:entities_formats(
          auditor(auditor(id, first_name, last_name, email)), 
          format(
            *,
            created_by(id, role, first_name, last_name, email),
            headers:format_headers(id, header, type, order)
          )
        ),
        reviewed_by(*),
        modified_by(id, first_name, last_name, email)
        `
      )
      .match(filters);
    if (error) {
      throw new Error(`Error al obtener las entradas: ${error.message}`);
    }

    // Si hay entradas, obtener también sus valores
    if (data && data.length > 0) {
      const entryIds = data.map((entry) => entry.id);
      const { data: valuesData, error: valuesError } = await supabase
        .from("format_values")
        .select("*")
        .in("entry_id", entryIds);

      if (valuesError) {
        throw new Error(`Error al obtener valores: ${valuesError.message}`);
      }

      // Agregar valores a cada entrada
      data.forEach((entry) => {
        entry.values = valuesData.filter(
          (value) => value.entry_id === entry.id
        );
      });
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
      .select(
        `*,
        entities_formats_id:entities_formats(
        entity(*),
          auditor(auditor(id, first_name, last_name, email)), 
          format(
            *,
            created_by(id, role, first_name, last_name, email),
            headers:format_headers(id, header, type, order)
          ),
          due_date,
          area(*, entity(*), predecessor(id, first_name, last_name, email), successor(id, first_name, last_name, email)),
          status,
          is_active
        ),
        reviewed_by(*),
        modified_by(id, first_name, last_name, email)
        `
      )
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

    // Obtener los valores asociados a esta entrada
    const { data: valuesData, error: valuesError } = await supabase
      .from("format_values")
      .select("*")
      .eq("entry_id", id);

    if (valuesError) {
      throw new Error(`Error al obtener valores: ${valuesError.message}`);
    }

    // Agregar valores a la entrada
    data[0].values = valuesData;

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
    // Primero, obtenemos el formato_id desde la tabla entities_formats
    const { data: entityFormatData, error: entityFormatError } = await supabase
      .from("entities_formats")
      .select("format")
      .eq("id", format_id)
      .single();

    if (entityFormatError) {
      throw new Error(
        `Error al obtener el formato: ${entityFormatError.message}`
      );
    }

    if (!entityFormatData || !entityFormatData.format) {
      throw new Error(
        `No se encontró el formato para la entidad con ID ${format_id}`
      );
    }

    const realFormatId = entityFormatData.format;

    // Obtener headers del formato
    const { data: headers, error: headersError } = await supabase
      .from("format_headers")
      .select("id, header, type, order")
      .eq("format_id", realFormatId)
      .order("order", { ascending: true });

    if (headersError)
      throw new Error(
        `Error al obtener los encabezados: ${headersError.message}`
      );

    if (!headers || headers.length === 0) {
      return {
        data: [],
        headers: [],
        success: true,
        message: "No hay encabezados definidos para este formato",
      };
    }

    // Obtener todas las entradas para el formato
    const { data: entries, error: entriesError } = await supabase
      .from("format_entries")
      .select("id, version, created_at, modified_at, modified_by")
      .eq("entities_formats_id", format_id);

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
        version: entry.version,
        created_at: entry.created_at,
        modified_at: entry.modified_at,
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
