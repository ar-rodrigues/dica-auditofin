import { getRoles, getRoleById } from "./roles";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const getAll = searchParams.get("getAll");
  const id = searchParams.get("id");

  try {
    if (id) {
      const role = await getRoleById(id);
      return NextResponse.json(role);
    }
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
