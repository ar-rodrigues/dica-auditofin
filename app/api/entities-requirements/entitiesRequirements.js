"use server";
import { createClient } from "@/utils/supabase/server";

export async function getEntitiesRequirements() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("entities_requirements")
      .select("*, entity:entities(*), requirement:requirements(*)");

    if (error) {
      throw new Error(
        `Failed to fetch entities requirements: ${error.message}`
      );
    }

    return { data, success: true };
  } catch (error) {
    console.error("Error fetching entities requirements:", error);
    return { data: [], success: false };
  }
}

export async function getEntityRequirementById(id) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("entities_requirements")
      .select("*, entity:entities(*), requirement:requirements(*)")
      .eq("id", id);

    if (error) {
      throw new Error(
        `Failed to fetch entity requirement with id ${id}: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Entity requirement with id ${id} not found`,
      };
    }

    return { data: data[0], success: true };
  } catch (error) {
    console.error("Error fetching entity requirement by id:", error);
    return { data: null, success: false };
  }
}

export async function createEntityRequirement(entityRequirement) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("entities_requirements")
      .insert(entityRequirement)
      .select("*");

    if (error) {
      throw new Error(`Failed to create entity requirement: ${error.message}`);
    }

    return {
      data: data[0],
      success: true,
      message: "Entity requirement created successfully",
    };
  } catch (error) {
    console.error("Error creating entity requirement:", error);
    return { data: null, success: false };
  }
}

export async function updateEntityRequirement(id, entityRequirement) {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("entities_requirements")
      .update(entityRequirement)
      .eq("id", id)
      .select("*");

    if (error) {
      throw new Error(
        `Failed to update entity requirement with id ${id}: ${error.message}`
      );
    }

    if (!data || data.length === 0) {
      return {
        data: null,
        success: false,
        message: `Entity requirement with id ${id} not found`,
      };
    }

    return {
      data: data[0],
      success: true,
      message: "Entity requirement updated successfully",
    };
  } catch (error) {
    console.error("Error updating entity requirement:", error);
    return { data: null, success: false };
  }
}

export async function deleteEntityRequirement(id) {
  const supabase = await createClient();
  try {
    // Check if entity requirement exists before deleting
    const { data: existingData, error: existingError } = await supabase
      .from("entities_requirements")
      .select("id")
      .eq("id", id)
      .maybeSingle();

    if (existingError) {
      throw new Error(
        `Failed to check entity requirement existence: ${existingError.message}`
      );
    }

    if (!existingData) {
      return {
        success: false,
        message: `Entity requirement with id ${id} not found`,
      };
    }

    const { error } = await supabase
      .from("entities_requirements")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(
        `Failed to delete entity requirement with id ${id}: ${error.message}`
      );
    }

    return {
      success: true,
      message: "Entity requirement deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting entity requirement:", error);
    return { success: false, message: "Failed to delete entity requirement" };
  }
}
