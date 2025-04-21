"use server";
import { createClient } from "@/utils/supabase/server";

export async function getRequirements() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requirements")
    .select("*, document_type:document_types(id, format)");

  if (error) {
    throw new Error(`Failed to fetch requirements: ${error.message}`);
  }

  return { data, success: true };
}

export async function getRequirementById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requirements")
    .select("*, document_type:document_types(id, format)")
    .eq("id", id);

  if (error) {
    throw new Error(
      `Failed to fetch requirement with id ${id}: ${error.message}`
    );
  }

  if (!data || data.length === 0) {
    return {
      data: null,
      success: false,
      message: `Requirement with id ${id} not found`,
    };
  }

  return { data: data[0], success: true };
}

export async function createRequirement(requirement) {
  const supabase = await createClient();

  // Make sure file_type is an array (even if empty)
  if (!requirement.file_type) {
    requirement.file_type = [];
  }

  const { data, error } = await supabase
    .from("requirements")
    .insert(requirement)
    .select("*, document_type:document_types(id, format)");

  if (error) {
    throw new Error(`Failed to create requirement: ${error.message}`);
  }

  return { data, success: true, message: "Requirement created successfully" };
}

export async function updateRequirement(id, requirement) {
  const supabase = await createClient();

  // Make sure file_type is an array (even if empty)
  if (!requirement.file_type) {
    requirement.file_type = [];
  }

  const { data, error } = await supabase
    .from("requirements")
    .update(requirement)
    .eq("id", id)
    .select("*, document_type:document_types(id, format)");

  if (error) {
    throw new Error(
      `Failed to update requirement with id ${id}: ${error.message}`
    );
  }

  if (!data || data.length === 0) {
    return {
      data: null,
      success: false,
      message: `Requirement with id ${id} not found`,
    };
  }

  return {
    data: data[0],
    success: true,
    message: "Requirement updated successfully",
  };
}

export async function deleteRequirement(id) {
  const supabase = await createClient();

  // Check if requirement exists before deleting
  const { data: existingData, error: existingError } = await supabase
    .from("requirements")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw new Error(
      `Failed to check requirement existence: ${existingError.message}`
    );
  }

  if (!existingData) {
    return { success: false, message: `Requirement with id ${id} not found` };
  }

  const { error } = await supabase.from("requirements").delete().eq("id", id);

  if (error) {
    throw new Error(
      `Failed to delete requirement with id ${id}: ${error.message}`
    );
  }

  return { success: true, message: "Requirement deleted successfully" };
}
