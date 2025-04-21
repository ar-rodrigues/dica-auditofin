import { NextResponse } from "next/server";
import { createFile, deleteFile, updateFile } from "./storage";

export async function POST(request) {
  console.log("POST ROUTE");
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = formData.get("bucket");
    const fileName = formData.get("fileName");

    const result = await createFile(file, bucket, fileName);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error uploading file" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  console.log("DELETE ROUTE");
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("fileUrl");

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    const result = await deleteFile(fileUrl);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error deleting file" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const fileUrl = formData.get("fileUrl");

    console.log("File ROUTE", file);
    console.log("File URL ROUTE", fileUrl);

    const result = await updateFile(file, fileUrl);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Error updating file" },
      { status: 500 }
    );
  }
}
