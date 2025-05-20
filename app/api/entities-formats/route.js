import { NextResponse } from "next/server";
import { getEntitiesFormats, createEntityFormat } from "./entitiesFormats";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams);
    const response = await getEntitiesFormats(filters);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to get entities formats:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get entities formats",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const entityFormatData = await request.json();
    const response = await createEntityFormat(entityFormatData);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Failed to create entity format:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create entity format",
      },
      { status: 500 }
    );
  }
}
