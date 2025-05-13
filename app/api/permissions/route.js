import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import {
  getPermissions,
  getPermissionById,
  getPermissionByTableAsset,
  getPermissionByAssetId,
  getPermissionsByUserId,
  getPermissionsByRoleId,
  getPermissionsByEntityId,
  createPermission,
  updatePermission,
  deletePermission,
} from "./permissions";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const tableAsset = searchParams.get("tableAsset");
  const assetId = searchParams.get("assetId");
  const userId = searchParams.get("userId");
  const roleId = searchParams.get("roleId");
  const entityId = searchParams.get("entityId");

  try {
    let data;

    if (id) {
      data = await getPermissionById(id);
    } else if (tableAsset) {
      data = await getPermissionByTableAsset(tableAsset);
    } else if (assetId) {
      data = await getPermissionByAssetId(assetId);
    } else if (userId) {
      data = await getPermissionsByUserId(userId);
    } else if (roleId) {
      data = await getPermissionsByRoleId(roleId);
    } else if (entityId) {
      data = await getPermissionsByEntityId(entityId);
    } else {
      data = await getPermissions();
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const supabase = await createClient();

    // Check if a permission already exists for this asset
    if (body.asset_id) {
      const { data: existingPermission } = await supabase
        .from("permissions")
        .select("*")
        .eq("asset_id", body.asset_id)
        .single();

      if (existingPermission) {
        // Update the existing permission instead of creating a new one
        const updatedPermission = await updatePermission(
          existingPermission.id,
          {
            ...body,
            users: [
              ...new Set([
                ...(existingPermission.users || []),
                ...(body.users || []),
              ]),
            ],
            roles: [
              ...new Set([
                ...(existingPermission.roles || []),
                ...(body.roles || []),
              ]),
            ],
            entities: [
              ...new Set([
                ...(existingPermission.entities || []),
                ...(body.entities || []),
              ]),
            ],
          }
        );
        return NextResponse.json(updatedPermission);
      }
    }

    const data = await createPermission(body);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const data = await updatePermission(body.id, body);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const data = await deletePermission(id);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
