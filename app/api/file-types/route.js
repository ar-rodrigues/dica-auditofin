import { NextResponse } from "next/server";
import { getFileTypes, createFileType } from "./fileTypes";

export async function GET() {
  try {
    const result = await getFileTypes();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching file types:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const fileType = await request.json();

    const result = await createFileType(fileType);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating file type:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
