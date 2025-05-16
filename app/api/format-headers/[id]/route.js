import { NextResponse } from "next/server";
import {
  getFormatHeaderById,
  updateFormatHeader,
  deleteFormatHeader,
} from "../formatHeaders";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const response = await getFormatHeaderById(id);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error al obtener el encabezado con id ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener el encabezado",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const headerData = await request.json();
    const response = await updateFormatHeader(id, headerData);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(
      `Error al actualizar el encabezado con id ${params.id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al actualizar el encabezado",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const response = await deleteFormatHeader(id);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(
      `Error al eliminar el encabezado con id ${params.id}:`,
      error
    );
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al eliminar el encabezado",
      },
      { status: 500 }
    );
  }
}
