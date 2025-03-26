import { getRoles } from "./roles";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const getAll = searchParams.get("getAll");

  try {
    const roles = await getRoles(getAll);
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Error fetching roles" },
      { status: 500 }
    );
  }
}
