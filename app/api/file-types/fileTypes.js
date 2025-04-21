"use server";
import { createClient } from "@/utils/supabase/server";

export async function getFileTypes() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("file_types").select("*");

  if (error) {
    throw new Error(`Failed to fetch file types: ${error.message}`);
  }

  return { data, success: true };
}

export async function getFileTypeById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("file_types")
    .select("*")
    .eq("id", id);

  if (error) {
    throw new Error(
      `Failed to fetch file type with id ${id}: ${error.message}`
    );
  }

  if (!data || data.length === 0) {
    return {
      data: null,
      success: false,
      message: `File type with id ${id} not found`,
    };
  }

  return { data: data[0], success: true };
}

export async function createFileType(fileType) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("file_types")
    .insert(fileType)
    .select();

  if (error) {
    throw new Error(`Failed to create file type: ${error.message}`);
  }

  return { data, success: true, message: "File type created successfully" };
}

export async function updateFileType(id, fileType) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("file_types")
    .update(fileType)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(
      `Failed to update file type with id ${id}: ${error.message}`
    );
  }

  if (!data || data.length === 0) {
    return {
      data: null,
      success: false,
      message: `File type with id ${id} not found`,
    };
  }

  return {
    data: data[0],
    success: true,
    message: "File type updated successfully",
  };
}

export async function deleteFileType(id) {
  const supabase = await createClient();

  // Check if file type exists before deleting
  const { data: existingData, error: existingError } = await supabase
    .from("file_types")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw new Error(
      `Failed to check file type existence: ${existingError.message}`
    );
  }

  if (!existingData) {
    return { success: false, message: `File type with id ${id} not found` };
  }

  const { error } = await supabase.from("file_types").delete().eq("id", id);

  if (error) {
    throw new Error(
      `Failed to delete file type with id ${id}: ${error.message}`
    );
  }

  return { success: true, message: "File type deleted successfully" };
}
