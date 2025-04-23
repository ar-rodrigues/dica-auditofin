import { NextResponse } from "next/server";
import {
  getEntityRequirementById,
  updateEntityRequirement,
  deleteEntityRequirement,
} from "../entitiesRequirements";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const response = await getEntityRequirementById(id);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(
      `Failed to get entity requirement with id ${params.id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get entity requirement",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const entityRequirementData = await request.json();

    const response = await updateEntityRequirement(id, entityRequirementData);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(
      `Failed to update entity requirement with id ${params.id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update entity requirement",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const response = await deleteEntityRequirement(id);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(
      `Failed to delete entity requirement with id ${params.id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete entity requirement",
      },
      { status: 500 }
    );
  }
}
