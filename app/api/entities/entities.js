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
