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

    // Always select all fields for internal permission checks
    if (!shouldSanitize) {
      query = query.select("*");
    } else if (userRole.role === "admin" || userRole.role === "super admin") {
      query = query.select("*");
    } else {
      // For regular users, still select all fields but we'll sanitize the response
      query = query.select("*");
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
      // For regular users, only return permissions they have access to
      const userData = await getUserData();
      const userId = userData?.id;
      const userRoleId = userData?.role?.id;
      const userEntityId = userData?.entity?.id;

      if (!userId || !userRoleId || !userEntityId) {
        console.error("Incomplete user data for permission check");
        return [];
      }

      // Filter permissions to only those the user has access to
      const accessiblePermissions = data.filter((permission) => {
        const users = Array.isArray(permission.users) ? permission.users : [];
        const roles = Array.isArray(permission.roles) ? permission.roles : [];
        const entities = Array.isArray(permission.entities)
          ? permission.entities
          : [];

        const hasUserAccess = users.length > 0 && users.includes(userId);
        const hasRoleAccess = roles.length > 0 && roles.includes(userRoleId);
        const hasEntityAccess =
          entities.length > 0 && entities.includes(userEntityId);

        return hasUserAccess || hasRoleAccess || hasEntityAccess;
      });

      // Then sanitize the filtered permissions
      return accessiblePermissions.map(sanitizePermissionData);
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

  // Log user data for debugging
  console.log("User data in checkResourcePermission:", userData);

  // Super admins have access to everything
  if (userData?.role?.role === "super admin") {
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

    // Log permissions for debugging
    console.log("Permissions in checkResourcePermission:", permissions);

    if (!permissions || permissions.length === 0) {
      console.log("No permissions found for resource");
      return false;
    }

    const userId = userData?.id;
    const userRoleId = userData?.role?.id;
    const userEntityId = userData?.entity?.id;

    // Log user identifiers for debugging
    console.log("User identifiers:", { userId, userRoleId, userEntityId });

    // If user data is incomplete, deny access
    if (!userId || !userRoleId || !userEntityId) {
      console.error("Incomplete user data for permission check:", {
        userId,
        userRoleId,
        userEntityId,
      });
      return false;
    }

    // Check if user has access through any permission
    const hasAccess = permissions.some((permission) => {
      // Ensure arrays exist and are not null
      const users = Array.isArray(permission.users) ? permission.users : [];
      const roles = Array.isArray(permission.roles) ? permission.roles : [];
      const entities = Array.isArray(permission.entities)
        ? permission.entities
        : [];

      // Check if user has access through any permission type
      const hasUserAccess = users.length > 0 && users.includes(userId);
      const hasRoleAccess = roles.length > 0 && roles.includes(userRoleId);
      const hasEntityAccess =
        entities.length > 0 && entities.includes(userEntityId);

      // Log permission check results for debugging
      console.log("Permission check results:", {
        permissionId: permission.id,
        hasUserAccess,
        hasRoleAccess,
        hasEntityAccess,
      });

      return hasUserAccess || hasRoleAccess || hasEntityAccess;
    });

    console.log("Final access result:", hasAccess);
    return hasAccess;
  } catch (error) {
    console.error("Error checking resource permission:", error);
    return false;
  }
};
