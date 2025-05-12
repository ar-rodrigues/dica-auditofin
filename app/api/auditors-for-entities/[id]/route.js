"use server";
import { NextResponse } from "next/server";
import {
  getAuditorForEntitiesById,
  updateAuditorForEntities,
  deleteAuditorForEntities,
} from "../auditorsForEntity";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const response = await getAuditorForEntitiesById(id);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to get auditor for entity:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get auditor for entity",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const auditorForEntityData = await request.json();
    const response = await updateAuditorForEntities(id, auditorForEntityData);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to update auditor for entity:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update auditor for entity",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const response = await deleteAuditorForEntities(id);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to delete auditor for entity:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete auditor for entity",
      },
      { status: 500 }
    );
  }
}
