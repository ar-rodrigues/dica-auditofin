import { createClient } from "@/utils/supabase/server";
import { getUserRole } from "../users/userRole/getUserRole";
import { getUserData } from "../users/getUserData/getUserData";

// Helper function to sanitize permission data
const sanitizePermissionData = (permission) => {
  return {
    id: permission.id,
    created_at: permission.created_at,
    table_asset: permission.table_asset,
    asset_id: permission.asset_id,
    has_access: true, // Indicates the user has access without exposing specific IDs
  };
};

export const fetchPermissions = async (
  filter,
  key,
  value,
  shouldSanitize = true
) => {
  const supabase = await createClient();
  const userRole = await getUserRole();

  try {
    let query = supabase.from("permissions");

    if (userRole.role === "admin" || userRole.role === "super admin") {
      query = query.select("*");
    } else {
      query = query.select(
        "id, created_at, table_asset, asset_id, users, roles, entities"
      );
    }

    const { data, error } = await query.match(filter || { [key]: value });

    if (error) {
      console.error("Error fetching permissions:", error);
      return null;
    }

    // Only sanitize the response if explicitly requested and user is not admin
    if (
      shouldSanitize &&
      userRole.role !== "admin" &&
      userRole.role !== "super admin"
    ) {
      return data.map(sanitizePermissionData);
    }

    return data;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return null;
  }
};

export const getPermissions = async () => fetchPermissions({});

export const getPermissionById = (id) => fetchPermissions({ id });

export const getPermissionByTableAsset = (tableAsset) =>
  fetchPermissions({ table_asset: tableAsset });

export const getPermissionByAssetId = (assetId) =>
  fetchPermissions({ asset_id: assetId });

export const getPermissionsByUserId = async (userId) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("permissions")
      .select("*")
      .contains("users", [userId]);

    if (error) {
      console.error("Error fetching permissions by user:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching permissions by user:", error);
    return null;
  }
};

export const getPermissionsByRoleId = async (roleId) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("permissions")
      .select("*")
      .contains("roles", [roleId]);

    if (error) {
      console.error("Error fetching permissions by role:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching permissions by role:", error);
    return null;
  }
};

export const getPermissionsByEntityId = async (entityId) => {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("permissions")
      .select("*")
      .contains("entities", [entityId]);

    if (error) {
      console.error("Error fetching permissions by entity:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching permissions by entity:", error);
    return null;
  }
};

export const createPermission = async (permissionData) => {
  const supabase = await createClient();
  const userRole = await getUserRole();

  if (userRole.role !== "admin" && userRole.role !== "super admin") {
    return null;
  }

  // Ensure arrays are initialized if not provided
  const newPermissionData = {
    ...permissionData,
    users: permissionData.users || [],
    roles: permissionData.roles || [],
    entities: permissionData.entities || [],
  };

  try {
    const { data, error } = await supabase
      .from("permissions")
      .insert(newPermissionData)
      .select()
      .single();

    if (error) {
      console.error("Error creating permission:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error creating permission:", error);
    return null;
  }
};

export const updatePermission = async (id, permissionData) => {
  const supabase = await createClient();
  const userRole = await getUserRole();

  if (userRole.role !== "admin" && userRole.role !== "super admin") {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("permissions")
      .update(permissionData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating permission:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error updating permission:", error);
    return null;
  }
};

export const deletePermission = async (id) => {
  const supabase = await createClient();
  const userRole = await getUserRole();

  if (userRole.role !== "admin" && userRole.role !== "super admin") {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("permissions")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error deleting permission:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error deleting permission:", error);
    return null;
  }
};

// New function to check if a user has permission to access a resource
export const checkResourcePermission = async (tableAsset, assetId) => {
  const supabase = await createClient();
  const userData = await getUserData();

  // Super admins have access to everything
  if (userData?.[0]?.role.role === "super admin") {
    return true;
  }

  try {
    // Get full permission data (without sanitization) for internal check
    const permissions = await fetchPermissions(
      {
        table_asset: tableAsset,
        asset_id: assetId,
      },
      null,
      null,
      false
    ); // Pass false to prevent sanitization

    if (!permissions || permissions.length === 0) {
      return false;
    }

    // Check if user has access through any permission
    return permissions.some((permission) => {
      // Check if user's entity matches
      if (
        permission.entities?.length > 0 &&
        permission.entities.includes(userData?.[0]?.entity.id)
      ) {
        return true;
      }
      // Check if user's role matches
      if (
        permission.roles?.length > 0 &&
        permission.roles.includes(userData?.[0]?.role.id)
      ) {
        return true;
      }
      // Check if user's id matches
      if (
        permission.users?.length > 0 &&
        permission.users.includes(userData?.[0]?.id)
      ) {
        return true;
      }
      return false;
    });
  } catch (error) {
    console.error("Error checking resource permission:", error);
    return false;
  }
};
