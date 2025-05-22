import { NextResponse } from "next/server";
import {
  getFormatValues,
  createFormatValue,
  bulkInsertFormatValues,
  bulkUpdateFormatValues,
  bulkDeleteFormatValues,
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

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.has("bulkupdate")) {
      const valuesArray = await request.json();
      const response = await bulkUpdateFormatValues(valuesArray);
      return NextResponse.json(response, {
        status: response.success ? 200 : 400,
      });
    }
    return NextResponse.json(
      {
        success: false,
        message:
          "Operación no soportada. Use el endpoint específico para actualizar un valor.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error al actualizar valores:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al actualizar valores",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    if (searchParams.has("bulkdelete")) {
      const { ids } = await request.json();

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return NextResponse.json(
          {
            success: false,
            message: "Se requiere un array de IDs válido",
          },
          { status: 400 }
        );
      }

      const response = await bulkDeleteFormatValues(ids);
      return NextResponse.json(response, {
        status: response.success ? 200 : 400,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Operación no soportada. Use el endpoint específico para eliminar un valor individual.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error al eliminar valores:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al eliminar valores",
      },
      { status: 500 }
    );
  }
}
