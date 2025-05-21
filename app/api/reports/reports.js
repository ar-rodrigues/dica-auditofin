import { createClient } from "@/utils/supabase/server";
import { getUserData } from "../users/getUserData/getUserData";
import {
  fetchPermissions,
  checkResourcePermission,
} from "../permissions/permissions";

export async function getReportsById(id) {
  const supabase = await createClient();
  const userData = await getUserData();

  // Check if user has permission to access this report
  const hasPermission = await checkResourcePermission("reports", id);

  if (!hasPermission) {
    return [];
  }

  // If user has permission, fetch the report
  try {
    const { data, error } = await supabase
      .from("reports")
      .select("*, entity_name:entities(entity_name)")
      .eq("id", id);
    return data || [];
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function getReports() {
  const supabase = await createClient();
  const user = await getUserData();
  const userData = user?.data;

  // Log user data for debugging
  //console.log("User data in getReports:", userData);

  // if user is super admin, return all reports
  if (userData?.role?.role === "super admin") {
    const { data, error } = await supabase
      .from("reports")
      .select("*, entity_name:entities(entity_name)");
    return data || [];
  }

  try {
    // Get all permissions for reports - explicitly request unsanitized data
    const permissions = await fetchPermissions(
      { table_asset: "reports" },
      null,
      null,
      false // Pass false to prevent sanitization
    );

    // Log permissions for debugging
    console.log("Permissions in getReports:", permissions);

    if (!permissions || permissions.length === 0) {
      console.log("No permissions found for reports");
      return [];
    }

    const userId = userData?.id;
    const userRoleId = userData?.role?.id;
    const userEntityId = userData?.entity?.id;

    // Log user identifiers for debugging
    console.log("User identifiers in getReports:", {
      userId,
      userRoleId,
      userEntityId,
    });

    // If user data is incomplete, return no reports
    if (!userId || !userRoleId || !userEntityId) {
      console.error("Incomplete user data for reports access:", {
        userId,
        userRoleId,
        userEntityId,
      });
      return [];
    }

    // Filter permissions to only those that apply to this user
    const userPermissions = permissions.filter((permission) => {
      // Ensure arrays exist and are not null
      const users = Array.isArray(permission.users) ? permission.users : [];
      const roles = Array.isArray(permission.roles) ? permission.roles : [];
      const entities = Array.isArray(permission.entities)
        ? permission.entities
        : [];

      const hasUserAccess = users.length > 0 && users.includes(userId);
      const hasRoleAccess = roles.length > 0 && roles.includes(userRoleId);
      const hasEntityAccess =
        entities.length > 0 && entities.includes(userEntityId);

      // // Log permission check results for debugging
      // console.log("Permission check results in getReports:", {
      //   permissionId: permission.id,
      //   users,
      //   roles,
      //   entities,
      //   hasUserAccess,
      //   hasRoleAccess,
      //   hasEntityAccess,
      // });

      return hasUserAccess || hasRoleAccess || hasEntityAccess;
    });

    // Get unique asset_ids from user's permissions
    const allowedAssetIds = [
      ...new Set(userPermissions.map((p) => p.asset_id)),
    ];

    // Log allowed asset IDs for debugging
    console.log("Allowed asset IDs:", allowedAssetIds);

    if (allowedAssetIds.length === 0) {
      console.log("No allowed asset IDs found");
      return [];
    }

    // Fetch only the reports that user has permission to see
    const { data: reports, error: reportsError } = await supabase
      .from("reports")
      .select("*, entity_name:entities(entity_name)")
      .in("id", allowedAssetIds);

    if (reportsError) {
      console.error("Error fetching reports:", reportsError);
      return [];
    }

    // Log final reports for debugging
    //console.log("Final reports:", reports);

    return reports || [];
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export async function updateReport(id, updateData) {
  const supabase = await createClient();
  //console.log("updateData", updateData);
  // Check if user has permission to update this report
  const hasPermission = await checkResourcePermission("reports", id);

  if (!hasPermission) {
    return [];
  }

  const { name, entity_id, iframeUrlDesktop, iframeUrlMobile } = updateData;

  try {
    const { data, error } = await supabase
      .from("reports")
      .update({
        name,
        entity_id,
        iframeUrlDesktop,
        iframeUrlMobile,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error updating report:", error);
    throw error;
  }
}

export async function deleteReport(id) {
  const supabase = await createClient();

  // Check if user has permission to delete this report
  const hasPermission = await checkResourcePermission("reports", id);

  if (!hasPermission) {
    return [];
  }

  try {
    // First get the report to find its permissionId
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("permissionId")
      .eq("id", id)
      .single();

    if (reportError) {
      console.error("Error fetching report:", reportError);
      throw reportError;
    }

    // Delete the report first (this will cascade to the permission due to the foreign key)
    const { error: deleteReportError } = await supabase
      .from("reports")
      .delete()
      .eq("id", id);

    if (deleteReportError) {
      console.error("Error deleting report:", deleteReportError);
      throw deleteReportError;
    }

    // Then delete the permission
    if (report.permissionId) {
      const { error: deletePermissionError } = await supabase
        .from("permissions")
        .delete()
        .eq("id", report.permissionId);

      if (deletePermissionError) {
        console.error("Error deleting permission:", deletePermissionError);
        throw deletePermissionError;
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting report:", error);
    throw error;
  }
}

export async function createReport(reportData) {
  const supabase = await createClient();
  //console.log("reportData", reportData);
  const { name, entity_id, iframeUrlDesktop, iframeUrlMobile, permissions } =
    reportData;

  try {
    // First create the permission
    const { data: permission, error: permissionError } = await supabase
      .from("permissions")
      .insert({
        table_asset: "reports",
        users: permissions?.users || [],
        roles: permissions?.roles || [],
        entities: [...new Set([...(permissions?.entities || []), entity_id])], // Combine and deduplicate entities
      })
      .select()
      .single();

    if (permissionError) {
      console.error("Error creating permission:", permissionError);
      throw permissionError;
    }

    //console.log("Created permission:", permission);

    // Create the report with the permission ID
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .insert({
        name,
        entity_id,
        iframeUrlDesktop,
        iframeUrlMobile,
        permissionId: permission.id,
      })
      .select()
      .single();

    if (reportError) {
      // If report creation fails, clean up the permission
      await supabase.from("permissions").delete().eq("id", permission.id);
      throw reportError;
    }

    // Update the permission with the report's asset_id
    const { error: updateError } = await supabase
      .from("permissions")
      .update({ asset_id: report.id })
      .eq("id", permission.id);

    if (updateError) {
      console.error("Error updating permission with asset_id:", updateError);
      // Clean up both the report and permission
      await supabase.from("reports").delete().eq("id", report.id);
      await supabase.from("permissions").delete().eq("id", permission.id);
      throw updateError;
    }

    //console.log("Created report:", report);
    return report;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}
