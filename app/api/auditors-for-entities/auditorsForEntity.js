"use server";
import { createClient } from "@/utils/supabase/server";

export async function getAuditorsForEntities(filters = {}) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("auditors_for_entities")
      .select("*, entity:entities(*), auditor:profiles(*)")
      .match(filters);

    if (error) {
      throw new Error(`Failed to fetch auditors for entity: ${error.message}`);
    }

    return { data, success: true };
  } catch (error) {
    console.error("Error fetching auditors for entity:", error);
    return { data: [], success: false };
  }
}

export async function getAuditorForEntitiesById(id) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("auditors_for_entities")
      .select("*, entity:entities(*), auditor:profiles(*)")
      .eq("id", id);

    if (error) {
      throw new Error(
        `Failed to fetch auditor for entity with id ${id}: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Auditor for entity with id ${id} not found`,
      };
    }

    return { data: data[0], success: true };
  } catch (error) {
    console.error("Error fetching auditor for entity by id:", error);
    return { data: null, success: false };
  }
}

export async function createAuditorForEntities(auditorForEntity) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("auditors_for_entities")
      .insert(auditorForEntity)
      .select("*");

    if (error) {
      throw new Error(`Failed to create auditor for entity: ${error.message}`);
    }

    return {
      data: data[0],
      success: true,
      message: "Auditor for entity created successfully",
    };
  } catch (error) {
    console.error("Error creating auditor for entity:", error);
    return { data: null, success: false };
  }
}

export async function updateAuditorForEntities(id, auditorForEntity) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("auditors_for_entities")
      .update(auditorForEntity)
      .eq("id", id)
      .select("*");

    if (error) {
      throw new Error(
        `Failed to update auditor for entity with id ${id}: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Auditor for entity with id ${id} not found`,
      };
    }

    return {
      data: data[0],
      success: true,
      message: "Auditor for entity updated successfully",
    };
  } catch (error) {
    console.error("Error updating auditor for entity:", error);
    return { data: null, success: false };
  }
}

export async function deleteAuditorForEntities(id) {
  const supabase = await createClient();
  try {
    // Check if auditor for entity exists before deleting
    const { data: existingData, error: existingError } = await supabase
      .from("auditors_for_entities")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existingError) {
      throw new Error(
        `Failed to check auditor for entity existence: ${existingError.message}`
      );
    }

    if (!existingData) {
      return {
        success: false,
        message: `Auditor for entity with id ${id} not found`,
      };
    }

    const { error } = await supabase
      .from("auditors_for_entities")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(
        `Failed to delete auditor for entity with id ${id}: ${error.message}`
      );
    }

    return {
      success: true,
      message: "Auditor for entity deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting auditor for entity:", error);
    return { success: false, message: "Failed to delete auditor for entity" };
  }
}
