import { NextResponse } from "next/server";
import { getFormatById, updateFormat, deleteFormat } from "../formats";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const response = await getFormatById(id);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error al obtener el formato con id ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener el formato",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formatData = await request.json();
    const response = await updateFormat(id, formatData);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error al actualizar el formato con id ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al actualizar el formato",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const response = await deleteFormat(id);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error al eliminar el formato con id ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al eliminar el formato",
      },
      { status: 500 }
    );
  }
}
