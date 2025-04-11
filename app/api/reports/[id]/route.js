"use server";
import { NextResponse } from "next/server";
import { getReportsById, updateReport, deleteReport } from "../reports";

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const report = await getReportsById(id);
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching report" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();

  try {
    const updatedReport = await updateReport(id, body);
    return NextResponse.json(updatedReport);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating report" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    await deleteReport(id);
    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting report" },
      { status: 500 }
    );
  }
}
