import { NextResponse } from "next/server";
import {
  getEntityFormatById,
  updateEntityFormat,
  deleteEntityFormat,
} from "../entitiesFormats";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const response = await getEntityFormatById(id);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to get entity format:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get entity format",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const entityFormatData = await request.json();
    const response = await updateEntityFormat(id, entityFormatData);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to update entity format:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update entity format",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const response = await deleteEntityFormat(id);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to delete entity format:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete entity format",
      },
      { status: 500 }
    );
  }
}
