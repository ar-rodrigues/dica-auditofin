import { NextResponse } from "next/server";
import { getEntitiesAreas, createEntityArea } from "./entitiesAreas";

export async function GET() {
  try {
    const entitiesAreas = await getEntitiesAreas();
    return NextResponse.json({ data: entitiesAreas, success: true });
  } catch (error) {
    console.error("Error fetching entities areas:", error);
    return NextResponse.json(
      {
        error: error.message || "Error fetching entities areas",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const entityArea = await request.json();
    const newEntityArea = await createEntityArea(entityArea);
    return NextResponse.json(
      { data: newEntityArea, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating entity area:", error);
    return NextResponse.json(
      { error: error.message || "Error creating entity area", success: false },
      { status: 500 }
    );
  }
}
