import { NextResponse } from "next/server";
import {
  getPermissionById,
  updatePermission,
  deletePermission,
} from "../permissions";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await getPermissionById(id);

    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: "Permission not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const permissionData = await request.json();

    // Validate required fields if they are being updated
    if (permissionData.table_asset === "" || permissionData.asset_id === "") {
      return NextResponse.json(
        { error: "table_asset and asset_id cannot be empty" },
        { status: 400 }
      );
    }

    // Ensure arrays are properly formatted
    if (permissionData.users && !Array.isArray(permissionData.users)) {
      return NextResponse.json(
        { error: "users must be an array" },
        { status: 400 }
      );
    }
    if (permissionData.roles && !Array.isArray(permissionData.roles)) {
      return NextResponse.json(
        { error: "roles must be an array" },
        { status: 400 }
      );
    }
    if (permissionData.entities && !Array.isArray(permissionData.entities)) {
      return NextResponse.json(
        { error: "entities must be an array" },
        { status: 400 }
      );
    }

    const result = await updatePermission(id, permissionData);

    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: "Failed to update permission" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await deletePermission(id);

    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: "Failed to delete permission" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error processing request" },
      { status: 500 }
    );
  }
}
