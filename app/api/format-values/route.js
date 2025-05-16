import { NextResponse } from "next/server";
import {
  getFormatValues,
  createFormatValue,
  bulkInsertFormatValues,
} from "./formatValues";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams);
    const response = await getFormatValues(filters);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error al obtener los valores:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener los valores",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.has("bulk")) {
      const valuesArray = await request.json();
      const response = await bulkInsertFormatValues(valuesArray);
      return NextResponse.json(response, {
        status: response.success ? 201 : 400,
      });
    }
    const valueData = await request.json();
    const response = await createFormatValue(valueData);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Error al crear el valor:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al crear el valor",
      },
      { status: 500 }
    );
  }
}
