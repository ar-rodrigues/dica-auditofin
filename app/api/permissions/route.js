import {
  getPermissionByTableAsset,
  getPermissionByAssetId,
  getPermissionsByEntityId,
  getPermissionsByRoleId,
  getPermissionsByUserId,
  getPermissions,
  createPermission,
} from "./permissions";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const assetId = searchParams.get("assetId");
  const tableAsset = searchParams.get("tableAsset");
  const entityId = searchParams.get("entityId");
  const roleId = searchParams.get("roleId");
  const userId = searchParams.get("userId");

  try {
    let result;

    if (tableAsset) {
      result = await getPermissionByTableAsset(tableAsset);
    } else if (assetId) {
      result = await getPermissionByAssetId(assetId);
    } else if (entityId) {
      result = await getPermissionsByEntityId(entityId);
    } else if (roleId) {
      result = await getPermissionsByRoleId(roleId);
    } else if (userId) {
      result = await getPermissionsByUserId(userId);
    } else {
      result = await getPermissions();
    }

    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: "No permissions found" },
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

export async function POST(request) {
  try {
    const permissionData = await request.json();

    // Validate required fields
    if (!permissionData.table_asset || !permissionData.asset_id) {
      return NextResponse.json(
        { error: "table_asset and asset_id are required" },
        { status: 400 }
      );
    }

    const result = await createPermission(permissionData);

    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: "Failed to create permission" },
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
