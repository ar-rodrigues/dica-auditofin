"use server";
import { createClient } from "@/utils/supabase/server";

export async function getEntitiesAreas(filters = {}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("entities_areas")
    .select("*")
    .match(filters);

  if (error) {
    console.error("Database error fetching entities areas:", error);
    throw new Error(`Failed to fetch entities areas: ${error.message}`);
  }

  return data || [];
}

export async function getEntityAreaById(id) {
  if (!id) {
    throw new Error("Entity area ID is required");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("entities_areas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // No data found
    }
    console.error(`Database error fetching entity area ${id}:`, error);
    throw new Error(`Failed to fetch entity area: ${error.message}`);
  }

  return data;
}

export async function createEntityArea(entityArea) {
  if (!entityArea || Object.keys(entityArea).length === 0) {
    throw new Error("Entity area data is required");
  }

  //console.log("entityArea route", entityArea);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("entities_areas")
    .insert(entityArea)
    .select();

  if (error) {
    console.log("error", error);
    console.error("Database error creating entity area:", error);
    throw new Error(`Failed to create entity area: ${error.message}`);
  }

  return data;
}

export async function updateEntityArea(id, entityArea) {
  if (!id) {
    throw new Error("Entity area ID is required");
  }

  if (!entityArea || Object.keys(entityArea).length === 0) {
    throw new Error("Entity area update data is required");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("entities_areas")
    .update(entityArea)
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Database error updating entity area ${id}:`, error);
    throw new Error(`Failed to update entity area: ${error.message}`);
  }

  return data;
}

export async function deleteEntityArea(id) {
  if (!id) {
    throw new Error("Entity area ID is required");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("entities_areas")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error(`Database error deleting entity area ${id}:`, error);
    throw new Error(`Failed to delete entity area: ${error.message}`);
  }

  return data;
}
