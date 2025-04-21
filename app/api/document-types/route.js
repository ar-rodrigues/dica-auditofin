import { NextResponse } from "next/server";
import { getDocumentTypes, createDocumentType } from "./documentTypes";

export async function GET() {
  try {
    const response = await getDocumentTypes();
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to get document types:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get document types",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const documentTypeData = await request.json();

    // Basic validation
    if (!documentTypeData.name) {
      return NextResponse.json(
        { success: false, message: "Document type name is required" },
        { status: 400 }
      );
    }

    const response = await createDocumentType(documentTypeData);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Failed to create document type:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create document type",
      },
      { status: 500 }
    );
  }
}
