"use server";
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Get all reports
// if prop is passed, get report by id
export async function GET(req) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  console.log(id);
  try {
    if (id) {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", id);

      console.log(data);
      console.log(error);
      return NextResponse.json(data);
    }
    const { data, error } = await supabase.from("reports").select("*");
    console.log(data);
    console.log(error);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching reports" },
      { status: 500 }
    );
  }
}
