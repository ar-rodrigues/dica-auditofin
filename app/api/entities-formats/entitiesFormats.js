"use server";
import { createClient } from "@/utils/supabase/server";

export async function getEntitiesFormats(filters = {}) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("entities_formats")
      .select(
        `*, 
        entity:entities(*), 
        format:formats(*), 
        area:entities_areas(*), 
        auditor:auditors_for_entities(*, auditor: profiles(id, first_name, last_name, email)),
        predecessor:profiles!predecessor(id, first_name, last_name, email),
        successor:profiles!successor(id, first_name, last_name, email)`
      )
      .match(filters);

    if (error) {
      throw new Error(`Failed to fetch entities formats: ${error.message}`);
    }

    return { data, success: true };
  } catch (error) {
    console.error("Error fetching entities formats:", error);
    return { data: [], success: false };
  }
}

export async function getEntityFormatById(id) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("entities_formats")
      .select(
        "*, entity:entities(*), format:formats(*), area:entities_areas(*), auditor:auditors_for_entities(*, auditor: profiles(id, first_name, last_name, email)), predecessor: profiles(id, first_name, last_name, email), successor: profiles(id, first_name, last_name, email)"
      )
      .eq("id", id);

    if (error) {
      throw new Error(
        `Failed to fetch entity format with id ${id}: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Entity format with id ${id} not found`,
      };
    }

    return { data: data[0], success: true };
  } catch (error) {
    console.error("Error fetching entity format by id:", error);
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
      throw new Error(`Failed to create entity format: ${error.message}`);
    }

    return {
      data: data[0],
      success: true,
      message: "Entity format created successfully",
    };
  } catch (error) {
    console.error("Error creating entity format:", error);
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
        `Failed to update entity format with id ${id}: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Entity format with id ${id} not found`,
      };
    }

    return {
      data: data[0],
      success: true,
      message: "Entity format updated successfully",
    };
  } catch (error) {
    console.error("Error updating entity format:", error);
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
        `Failed to check entity format existence: ${existingError.message}`
      );
    }

    if (!existingData) {
      return {
        success: false,
        message: `Entity format with id ${id} not found`,
      };
    }

    const { error } = await supabase
      .from("entities_formats")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(
        `Failed to delete entity format with id ${id}: ${error.message}`
      );
    }

    return {
      success: true,
      message: "Entity format deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting entity format:", error);
    return { success: false, message: "Failed to delete entity format" };
  }
}
