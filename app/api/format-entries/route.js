import { NextResponse } from "next/server";
import {
  getFormatEntries,
  createFormatEntry,
  getFormatEntriesExcel,
} from "./formatEntries";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.has("excel") && searchParams.has("format_id")) {
      const format_id = searchParams.get("format_id");
      const response = await getFormatEntriesExcel(format_id);
      return NextResponse.json(response, { status: 200 });
    }
    const filters = Object.fromEntries(searchParams);
    const response = await getFormatEntries(filters);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las entradas:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener las entradas",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const entryData = await request.json();
    //console.log("entryData", entryData);
    const response = await createFormatEntry(entryData);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error al crear la entrada:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al crear la entrada",
      },
      { status: 500 }
    );
  }
}
