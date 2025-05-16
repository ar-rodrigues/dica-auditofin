import { NextResponse } from "next/server";
import {
  getFormatValueById,
  updateFormatValue,
  deleteFormatValue,
} from "../formatValues";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const response = await getFormatValueById(id);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error al obtener el valor con id ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener el valor",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const valueData = await request.json();
    const response = await updateFormatValue(id, valueData);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error al actualizar el valor con id ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al actualizar el valor",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const response = await deleteFormatValue(id);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error al eliminar el valor con id ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al eliminar el valor",
      },
      { status: 500 }
    );
  }
}
