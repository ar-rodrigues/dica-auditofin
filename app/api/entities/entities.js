"use server";
import { createClient } from "@/utils/supabase/server";

export async function getEntities() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from("entities").select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching entities:", error);
    return [];
  }
}

export async function getEntityById(id) {
  const supabase = await createClient();
  try {
    const { data: entity, error } = await supabase
      .from("entities")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return entity;
  } catch (error) {
    console.error("Error fetching entity:", error);
    return [];
  }
}

export async function updateEntity(id, data) {
  const supabase = await createClient();
  console.log("API UPDATE ENTITY", data);
  console.log("API UPDATE ENTITY ID", id);
  try {
    const { data: updatedEntity, error } = await supabase
      .from("entities")
      .update(data)
      .eq("id", id)
      .select();
    if (error) throw error;

    console.log("API UPDATE ENTITY UPDATED", updatedEntity);
    return updatedEntity;
  } catch (error) {
    console.error("Error updating entity:", error);
    return [];
  }
}
