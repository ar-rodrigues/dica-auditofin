import { NextResponse } from "next/server";
import {
  getDocumentTypeById,
  updateDocumentType,
  deleteDocumentType,
} from "../documentTypes";

export async function GET(request, { params }) {
  try {
    const id = params.id;
    const response = await getDocumentTypeById(id);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Failed to get document type with id ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get document type",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.id;
    const documentTypeData = await request.json();

    // Basic validation
    if (!documentTypeData.name) {
      return NextResponse.json(
        { success: false, message: "Document type name is required" },
        { status: 400 }
      );
    }

    const response = await updateDocumentType(id, documentTypeData);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(
      `Failed to update document type with id ${params.id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update document type",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const response = await deleteDocumentType(id);

    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(
      `Failed to delete document type with id ${params.id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to delete document type",
      },
      { status: 500 }
    );
  }
}
