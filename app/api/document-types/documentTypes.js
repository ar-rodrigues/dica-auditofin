"use server";
import { createClient } from "@/utils/supabase/server";

export async function getDocumentTypes() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("document_types").select("*");

  if (error) {
    throw new Error(`Failed to fetch document types: ${error.message}`);
  }

  return { data, success: true };
}

export async function getDocumentTypeById(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("document_types")
    .select("*")
    .eq("id", id);

  if (error) {
    throw new Error(
      `Failed to fetch document type with id ${id}: ${error.message}`
    );
  }

  if (!data || data.length === 0) {
    return {
      data: null,
      success: false,
      message: `Document type with id ${id} not found`,
    };
  }

  return { data: data[0], success: true };
}

export async function createDocumentType(documentType) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("document_types")
    .insert(documentType)
    .select("*");

  if (error) {
    throw new Error(`Failed to create document type: ${error.message}`);
  }

  return {
    data: data[0],
    success: true,
    message: "Document type created successfully",
  };
}

export async function updateDocumentType(id, documentType) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("document_types")
    .update(documentType)
    .eq("id", id)
    .select("*");

  if (error) {
    throw new Error(
      `Failed to update document type with id ${id}: ${error.message}`
    );
  }

  if (!data || data.length === 0) {
    return {
      data: null,
      success: false,
      message: `Document type with id ${id} not found`,
    };
  }

  return {
    data: data[0],
    success: true,
    message: "Document type updated successfully",
  };
}

export async function deleteDocumentType(id) {
  const supabase = await createClient();

  // Check if document type exists before deleting
  const { data: existingData, error: existingError } = await supabase
    .from("document_types")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (existingError) {
    throw new Error(
      `Failed to check document type existence: ${existingError.message}`
    );
  }

  if (!existingData) {
    return { success: false, message: `Document type with id ${id} not found` };
  }

  const { error } = await supabase.from("document_types").delete().eq("id", id);

  if (error) {
    throw new Error(
      `Failed to delete document type with id ${id}: ${error.message}`
    );
  }

  return { success: true, message: "Document type deleted successfully" };
}
