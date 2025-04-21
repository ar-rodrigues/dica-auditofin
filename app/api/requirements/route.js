import { NextResponse } from "next/server";
import { getRequirements, createRequirement } from "./requirements";

export async function GET() {
  try {
    const { data, success } = await getRequirements();

    if (!success) {
      return NextResponse.json(
        { error: "Failed to fetch requirements" },
        { status: 400 }
      );
    }

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error("Error fetching requirements:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const { data, success, message } = await createRequirement(body);

    if (!success) {
      return NextResponse.json(
        { error: message || "Failed to create requirement" },
        { status: 400 }
      );
    }

    return NextResponse.json({ data, success, message }, { status: 201 });
  } catch (error) {
    console.error("Error creating requirement:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
