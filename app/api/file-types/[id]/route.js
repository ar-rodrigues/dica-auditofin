import { NextResponse } from "next/server";
import { getFileTypeById, updateFileType, deleteFileType } from "../fileTypes";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "File type ID is required" },
        { status: 400 }
      );
    }

    const result = await getFileTypeById(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error fetching file type by ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const fileType = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "File type ID is required" },
        { status: 400 }
      );
    }

    const result = await updateFileType(id, fileType);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error updating file type with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "File type ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteFileType(id);

    if (!result.success) {
      return NextResponse.json(result, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(`Error deleting file type with ID ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
