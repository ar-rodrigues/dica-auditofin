import { NextResponse } from "next/server";
import { getFormats, createFormat } from "./formats";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams);
    const response = await getFormats(filters);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los formatos:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener los formatos",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const formatData = await request.json();
    // formatData debe incluir: name, created_by, headers (array)
    const response = await createFormat(formatData);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error al crear el formato:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al crear el formato",
      },
      { status: 500 }
    );
  }
}
