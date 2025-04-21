import { getEntities, createEntity } from "./entities";
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

export async function POST(request) {
  try {
    const body = await request.json();
    const newEntity = await createEntity(body);

    if (!newEntity) {
      return NextResponse.json(
        { error: "Error creating entity" },
        { status: 500 }
      );
    }

    return NextResponse.json(newEntity, { status: 201 });
  } catch (error) {
    console.error("Error creating entity:", error);
    return NextResponse.json(
      { error: "Error creating entity" },
      { status: 500 }
    );
  }
}
