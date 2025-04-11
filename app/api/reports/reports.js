import { createClient } from "@/utils/supabase/server";
import { getUserData } from "../users/getUserData/getUserData";
import { fetchPermissions } from "../permissions/permissions";

export async function getReportsById(id) {
  const supabase = await createClient();
  const userData = await getUserData();

  // if user is super admin, return all reports
  if (userData?.[0]?.role.role === "super admin") {
    const { data, error } = await supabase.from("reports").select("*");
    return data || [];
  }

  // First check permissions for this specific report
  const permissions = await fetchPermissions({
    table_asset: "reports",
    asset_id: id,
  });

  // If there are no permissions, return empty array (no access)
  if (permissions.length === 0) {
    console.log("no permissions");
    return [];
  }

  // Check if user has access to any of the permissions
  const hasPermission = permissions.some((permission) => {
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

  // If user doesn't have permission, return empty array
  if (!hasPermission) {
    return [];
  }

  // If user has permission, fetch the report
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("id", id);
    return data || [];
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function getReports() {
  const supabase = await createClient();
  const userData = await getUserData();

  // if user is super admin, return all reports
  if (userData?.[0]?.role.role === "super admin") {
    const { data, error } = await supabase.from("reports").select("*");
    return data || [];
  }

  try {
    // First get all permissions for reports
    const permissions = await fetchPermissions({ table_asset: "reports" });

    // If there are no permissions, return empty array (no access)
    if (!permissions) {
      return [];
    }

    // Filter permissions to get only the ones the user has access to
    const userPermissions = permissions.filter((permission) => {
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

    // If user has no permissions, return empty array
    if (userPermissions.length === 0) {
      return [];
    }

    // Get unique asset_ids from user's permissions
    const allowedAssetIds = [
      ...new Set(userPermissions.map((p) => p.asset_id)),
    ];

    // Fetch only the reports that user has permission to see
    const { data: reports, error: reportsError } = await supabase
      .from("reports")
      .select("*")
      .in("id", allowedAssetIds);

    if (reportsError) {
      console.error("Error fetching reports:", reportsError);
      return [];
    }

    return reports || [];
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function updateReport(id, updateData) {
  const supabase = await createClient();
  const userData = await getUserData();

  // First check permissions for this specific report
  const permissions = await fetchPermissions({
    table_asset: "reports",
    asset_id: id,
  });

  // If there are no permissions, return empty array (no access)
  if (!permissions || permissions.length === 0) {
    console.log("no permissions");
    return [];
  }

  // Check if user has access to any of the permissions
  const hasPermission = permissions.some((permission) => {
    if (
      permission.entities?.length > 0 &&
      permission.entities.includes(userData?.[0]?.entity.id)
    ) {
      return true;
    }
    if (
      permission.roles?.length > 0 &&
      permission.roles.includes(userData?.[0]?.role.id)
    ) {
      return true;
    }
    if (
      permission.users?.length > 0 &&
      permission.users.includes(userData?.[0]?.id)
    ) {
      return true;
    }
    return false;
  });

  // If user doesn't have permission, return empty array
  if (!hasPermission) {
    console.log("no permissions");
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("reports")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    console.log(data);
    console.log(error);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
}

export async function deleteReport(id) {
  const supabase = await createClient();
  const userData = await getUserData();

  // First check permissions for this specific report
  const permissions = await fetchPermissions({
    table_asset: "reports",
    asset_id: id,
  });

  // If there are no permissions, return empty array (no access)
  if (!permissions || permissions.length === 0) {
    return [];
  }

  // Check if user has access to any of the permissions
  const hasPermission = permissions.some((permission) => {
    if (
      permission.entities?.length > 0 &&
      permission.entities.includes(userData?.[0]?.entity.id)
    ) {
      return true;
    }
    if (
      permission.roles?.length > 0 &&
      permission.roles.includes(userData?.[0]?.role.id)
    ) {
      return true;
    }
    if (
      permission.users?.length > 0 &&
      permission.users.includes(userData?.[0]?.id)
    ) {
      return true;
    }
    return false;
  });

  // If user doesn't have permission, return empty array
  if (!hasPermission) {
    return [];
  }

  try {
    const { error } = await supabase.from("reports").delete().eq("id", id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
}

export async function createReport(reportData) {
  const supabase = await createClient();
  const userData = await getUserData();

  // Check if user has permission to create reports
  const permissions = await fetchPermissions({
    table_asset: "reports",
  });

  // If there are no permissions, return empty array (no access)
  if (!permissions || permissions.length === 0) {
    return [];
  }

  // Check if user has access to any of the permissions
  const hasPermission = permissions.some((permission) => {
    if (
      permission.entities?.length > 0 &&
      permission.entities.includes(userData?.[0]?.entity.id)
    ) {
      return true;
    }
    if (
      permission.roles?.length > 0 &&
      permission.roles.includes(userData?.[0]?.role.id)
    ) {
      return true;
    }
    if (
      permission.users?.length > 0 &&
      permission.users.includes(userData?.[0]?.id)
    ) {
      return true;
    }
    return false;
  });

  // If user doesn't have permission, return empty array
  if (!hasPermission) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from("reports")
      .insert(reportData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}
