import { NextResponse } from "next/server";
import {
  getRequirementById,
  updateRequirement,
  deleteRequirement,
} from "../requirements";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Requirement ID is required" },
        { status: 400 }
      );
    }

    const { data, success, message } = await getRequirementById(id);

    if (!success) {
      return NextResponse.json(
        { error: message || "Requirement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data, success });
  } catch (error) {
    console.error(`Error fetching requirement with id ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Requirement ID is required" },
        { status: 400 }
      );
    }

    const { data, success, message } = await updateRequirement(id, body);

    if (!success) {
      return NextResponse.json(
        { error: message || "Failed to update requirement" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data, success, message });
  } catch (error) {
    console.error(`Error updating requirement with id ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Requirement ID is required" },
        { status: 400 }
      );
    }

    const { success, message } = await deleteRequirement(id);

    if (!success) {
      return NextResponse.json(
        { error: message || "Requirement not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success, message });
  } catch (error) {
    console.error(`Error deleting requirement with id ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
