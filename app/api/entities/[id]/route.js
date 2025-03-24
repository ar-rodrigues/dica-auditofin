import { NextResponse } from "next/server";
import { getEntityById, updateEntity } from "@/app/api/entities/entities";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const entity = await getEntityById(id);
    return NextResponse.json(entity);
  } catch (error) {
    console.error("Error fetching entity:", error);
    return NextResponse.json(
      { error: "Error fetching entity" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const data = await request.json();

  try {
    const updatedEntity = await updateEntity(id, data);
    return NextResponse.json(updatedEntity);
  } catch (error) {
    console.error("Error updating entity:", error);
    return NextResponse.json(
      { error: "Error updating entity" },
      { status: 500 }
    );
  }
}
