"use server";
import { NextResponse } from "next/server";
import {
  getAuditorsForEntities,
  createAuditorForEntities,
} from "./auditorsForEntity";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams);
    const response = await getAuditorsForEntities(filters);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to get auditors for entity:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get auditors for entity",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auditorForEntityData = await request.json();
    const response = await createAuditorForEntities(auditorForEntityData);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Failed to create auditor for entity:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create auditor for entity",
      },
      { status: 500 }
    );
  }
}
