import { NextResponse } from "next/server";
import {
  getEntityAreaById,
  updateEntityArea,
  deleteEntityArea,
} from "../entitiesAreas";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is required", success: false },
        { status: 400 }
      );
    }

    const entityArea = await getEntityAreaById(id);

    if (!entityArea || entityArea.length === 0) {
      return NextResponse.json(
        { error: "Entity area not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: entityArea, success: true });
  } catch (error) {
    console.error("Error fetching entity area:", error);
    return NextResponse.json(
      { error: error.message || "Error fetching entity area", success: false },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is required", success: false },
        { status: 400 }
      );
    }

    const data = await request.json();
    const entityArea = await updateEntityArea(id, data);

    return NextResponse.json(
      { data: entityArea, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating entity area:", error);
    return NextResponse.json(
      { error: error.message || "Error updating entity area", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "ID parameter is required", success: false },
        { status: 400 }
      );
    }

    const entityArea = await deleteEntityArea(id);

    return NextResponse.json(
      { data: entityArea, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting entity area:", error);
    return NextResponse.json(
      { error: error.message || "Error deleting entity area", success: false },
      { status: 500 }
    );
  }
}
