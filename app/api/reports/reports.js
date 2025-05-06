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
  const userData = await getUserData();

  // if user is super admin, return all reports
  if (userData?.[0]?.role.role === "super admin") {
    const { data, error } = await supabase
      .from("reports")
      .select("*, entity_name:entities(entity_name)");
    return data || [];
  }

  try {
    // Get all permissions for reports
    const permissions = await fetchPermissions({ table_asset: "reports" });

    if (!permissions) {
      return [];
    }

    // Get unique asset_ids from user's permissions
    const allowedAssetIds = [...new Set(permissions.map((p) => p.asset_id))];

    // Fetch only the reports that user has permission to see
    const { data: reports, error: reportsError } = await supabase
      .from("reports")
      .select("*, entity_name:entities(entity_name)")
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
  console.log("updateData", updateData);
  // Check if user has permission to update this report
  const hasPermission = await checkResourcePermission("reports", id);

  if (!hasPermission) {
    return [];
  }

  const {
    name,
    entity_id,
    workspaceId,
    reportId,
    clientId,
    clientSecret,
    tenantId,
    iframeUrl,
  } = updateData;

  try {
    const { data, error } = await supabase
      .from("reports")
      .update({
        name,
        entity_id,
        workspaceId,
        reportId,
        clientId,
        clientSecret,
        tenantId,
        iframeUrl,
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
  console.log("reportData", reportData);
  const {
    name,
    entity_id,
    workspaceId,
    reportId,
    clientId,
    clientSecret,
    tenantId,
    iframeUrl,
  } = reportData;

  try {
    const { data, error } = await supabase
      .from("reports")
      .insert({
        name,
        entity_id,
        workspaceId,
        reportId,
        clientId,
        clientSecret,
        tenantId,
        iframeUrl,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
}
