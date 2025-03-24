import { getRoles } from "./roles";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const roles = await getRoles();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Error fetching roles" },
      { status: 500 }
    );
  }
}
