"use server";
import { NextResponse } from "next/server";
import { getReportsById, getReports, createReport } from "./reports";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const report = await getReportsById(id);
      return NextResponse.json(report);
    }

    const reports = await getReports();
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching reports" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newReport = await createReport(body);
    return NextResponse.json(newReport, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating report" },
      { status: 500 }
    );
  }
}
