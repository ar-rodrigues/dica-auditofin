"use server";
import { createClient } from "@/utils/supabase/server";

export async function getFormatValues(filters = {}) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_values")
      .select("*, headers:format_headers(*)")
      .match(filters);
    if (error) {
      throw new Error(`Error al obtener los valores: ${error.message}`);
    }
    return { data, success: true };
  } catch (error) {
    console.error("Error al obtener los valores:", error);
    return { data: [], success: false };
  }
}

export async function getFormatValueById(id) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_values")
      .select("*, headers:format_headers(*)")
      .eq("id", id);
    if (error) {
      throw new Error(
        `Error al obtener el valor con id ${id}: ${error.message}`
      );
    }
    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Valor con id ${id} no encontrado`,
      };
    }
    return { data: data[0], success: true };
  } catch (error) {
    console.error("Error al obtener el valor por id:", error);
    return { data: null, success: false };
  }
}

export async function createFormatValue(value) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_values")
      .insert(value)
      .select("*");
    if (error) {
      throw new Error(`Error al crear el valor: ${error.message}`);
    }
    return {
      data: data[0],
      success: true,
      message: "Valor creado exitosamente",
    };
  } catch (error) {
    console.error("Error al crear el valor:", error);
    return { data: null, success: false };
  }
}

export async function updateFormatValue(id, value) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("format_values")
      .update(value)
      .eq("id", id)
      .select("*");
    if (error) {
      throw new Error(
        `Error al actualizar el valor con id ${id}: ${error.message}`
      );
    }
    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Valor con id ${id} no encontrado`,
      };
    }
    return {
      data: data[0],
      success: true,
      message: "Valor actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error al actualizar el valor:", error);
    return { data: null, success: false };
  }
}

export async function deleteFormatValue(id) {
  const supabase = await createClient();
  try {
    const { data: existingData, error: existingError } = await supabase
      .from("format_values")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    if (existingError) {
      throw new Error(
        `Error al verificar existencia del valor: ${existingError.message}`
      );
    }
    if (!existingData) {
      return {
        success: false,
        message: `Valor con id ${id} no encontrado`,
      };
    }
    const { error } = await supabase
      .from("format_values")
      .delete()
      .eq("id", id);
    if (error) {
      throw new Error(
        `Error al eliminar el valor con id ${id}: ${error.message}`
      );
    }
    return {
      success: true,
      message: "Valor eliminado exitosamente",
    };
  } catch (error) {
    console.error("Error al eliminar el valor:", error);
    return { success: false, message: "Error al eliminar el valor" };
  }
}

export async function bulkInsertFormatValues(valuesArray) {
  const supabase = await createClient();
  try {
    if (!Array.isArray(valuesArray) || valuesArray.length === 0) {
      throw new Error("El array de valores está vacío o no es válido");
    }
    const { data, error } = await supabase
      .from("format_values")
      .insert(valuesArray)
      .select("*");
    if (error) {
      throw new Error(
        `Error al insertar valores masivamente: ${error.message}`
      );
    }
    return {
      data,
      success: true,
      message: "Valores insertados exitosamente",
    };
  } catch (error) {
    console.error("Error en inserción masiva de valores:", error);
    return { data: null, success: false, message: error.message };
  }
}

export async function bulkUpdateFormatValues(valuesArray) {
  const supabase = await createClient();
  try {
    if (!Array.isArray(valuesArray) || valuesArray.length === 0) {
      throw new Error("El array de valores está vacío o no es válido");
    }
    const { data, error } = await supabase
      .from("format_values")
      .upsert(valuesArray)
      .select("*");
    if (error) {
      throw new Error(
        `Error al actualizar valores masivamente: ${error.message}`
      );
    }
    return {
      data,
      success: true,
      message: "Valores actualizados exitosamente",
    };
  } catch (error) {
    console.error("Error en actualización masiva de valores:", error);
    return { data: null, success: false, message: error.message };
  }
}

export async function bulkDeleteFormatValues(idArray) {
  const supabase = await createClient();
  try {
    if (!Array.isArray(idArray) || idArray.length === 0) {
      throw new Error("El array de IDs está vacío o no es válido");
    }

    // Verificar primero si todos los IDs existen
    const { data: existingData, error: existingError } = await supabase
      .from("format_values")
      .select("id")
      .in("id", idArray);

    if (existingError) {
      throw new Error(
        `Error al verificar existencia de los valores: ${existingError.message}`
      );
    }

    // Comprobar que todos los IDs existan
    const foundIds = existingData.map((item) => item.id);
    const missingIds = idArray.filter((id) => !foundIds.includes(id));

    if (missingIds.length > 0) {
      console.warn(
        `Algunos IDs no fueron encontrados: ${missingIds.join(", ")}`
      );
    }

    // Continuar con la eliminación de los IDs que sí existen
    if (foundIds.length === 0) {
      return {
        success: false,
        message: "Ninguno de los IDs especificados fue encontrado",
      };
    }

    const { error } = await supabase
      .from("format_values")
      .delete()
      .in("id", foundIds);

    if (error) {
      throw new Error(
        `Error al eliminar valores masivamente: ${error.message}`
      );
    }

    return {
      success: true,
      message: `${foundIds.length} valores eliminados exitosamente`,
      deletedCount: foundIds.length,
      missingCount: missingIds.length,
    };
  } catch (error) {
    console.error("Error en eliminación masiva de valores:", error);
    return {
      success: false,
      message: error.message || "Error al eliminar valores masivamente",
    };
  }
}
