import { getEntities } from "./entities";
import { NextResponse } from "next/server";

export async function GET() {
  const entities = await getEntities();
  try {
    return NextResponse.json(entities);
  } catch (error) {
    console.error("Error fetching entities:", error);
    return NextResponse.json(
      { error: "Error fetching entities" },
      { status: 500 }
    );
  }
}
