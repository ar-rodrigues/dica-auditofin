import { NextResponse } from "next/server";
import { getFormatHeaders, createFormatHeader } from "./formatHeaders";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams);
    const response = await getFormatHeaders(filters);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los encabezados:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener los encabezados",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const headerData = await request.json();
    const response = await createFormatHeader(headerData);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error al crear el encabezado:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al crear el encabezado",
      },
      { status: 500 }
    );
  }
}
