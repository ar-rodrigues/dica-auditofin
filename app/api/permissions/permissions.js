import { createClient } from "@/utils/supabase/server";
import { getUserRole } from "../users/userRole/getUserRole";

export const fetchPermissions = async (filter, key, value) => {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("permissions")
      .select("*")
      .match(filter || { [key]: value });

    if (error) {
      console.error("Error fetching permissions:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return null;
  }
};

export const getPermissions = async () => {
  const userRole = await getUserRole();
  if (userRole.role === "admin" || userRole.role === "super admin") {
    return fetchPermissions({});
  } else {
    return null;
  }
};

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
