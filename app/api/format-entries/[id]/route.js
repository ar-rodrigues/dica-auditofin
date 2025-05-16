import { NextResponse } from "next/server";
import {
  getFormatEntryById,
  updateFormatEntry,
  deleteFormatEntry,
} from "../formatEntries";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const response = await getFormatEntryById(id);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error al obtener la entrada con id ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al obtener la entrada",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const entryData = await request.json();
    const response = await updateFormatEntry(id, entryData);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error al actualizar la entrada con id ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al actualizar la entrada",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const response = await deleteFormatEntry(id);
    if (!response.success) {
      return NextResponse.json(response, { status: 404 });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error(`Error al eliminar la entrada con id ${params.id}:`, error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error al eliminar la entrada",
      },
      { status: 500 }
    );
  }
}
