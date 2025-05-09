import { NextResponse } from "next/server";
import {
  getEntitiesRequirements,
  createEntityRequirement,
} from "./entitiesRequirements";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filters = Object.fromEntries(searchParams);
    //console.log("filters", filters);
    const response = await getEntitiesRequirements(filters);
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Failed to get entities requirements:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to get entities requirements",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const entityRequirementData = await request.json();

    const response = await createEntityRequirement(entityRequirementData);
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error("Failed to create entity requirement:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create entity requirement",
      },
      { status: 500 }
    );
  }
}
