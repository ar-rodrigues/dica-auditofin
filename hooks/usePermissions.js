import { useState, useEffect } from "react";

export const usePermissions = ({
  userId,
  roleId,
  entityId,
  assetId,
  tableAsset,
} = {}) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPermissions = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);

      let url = "/api/permissions";
      const queryParams = new URLSearchParams();

      // Use provided params or fallback to hook params
      const effectiveParams = {
        userId: params.userId ?? userId,
        roleId: params.roleId ?? roleId,
        entityId: params.entityId ?? entityId,
        assetId: params.assetId ?? assetId,
        tableAsset: params.tableAsset ?? tableAsset,
      };

      if (effectiveParams.userId)
        queryParams.append("userId", effectiveParams.userId);
      if (effectiveParams.roleId)
        queryParams.append("roleId", effectiveParams.roleId);
      if (effectiveParams.entityId)
        queryParams.append("entityId", effectiveParams.entityId);
      if (effectiveParams.assetId)
        queryParams.append("assetId", effectiveParams.assetId);
      if (effectiveParams.tableAsset)
        queryParams.append("tableAsset", effectiveParams.tableAsset);

      const queryString = queryParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch permissions");
      }

      const data = await response.json();
      setPermissions(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error("Error fetching permissions:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [userId, roleId, entityId, assetId, tableAsset]);

  const createPermission = async (permissionData) => {
    // Check if all permission arrays are empty
    const isEmpty =
      !permissionData.users?.length &&
      !permissionData.roles?.length &&
      !permissionData.entities?.length;

    if (isEmpty) {
      throw new Error(
        "At least one permission (user, role, or entity) must be specified"
      );
    }

    try {
      const response = await fetch("/api/permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(permissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create permission");
      }

      const newPermission = await response.json();
      setPermissions((prev) => [...prev, newPermission]);
      return newPermission;
    } catch (err) {
      console.error("Error creating permission:", err);
      throw err;
    }
  };

  const updatePermission = async (id, permissionData) => {
    // Check if all permission arrays are empty
    const isEmpty =
      !permissionData.users?.length &&
      !permissionData.roles?.length &&
      !permissionData.entities?.length;

    if (isEmpty) {
      throw new Error(
        "At least one permission (user, role, or entity) must be specified"
      );
    }

    try {
      const response = await fetch(`/api/permissions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(permissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update permission");
      }

      const updatedPermission = await response.json();
      setPermissions((prev) =>
        prev.map((p) => (p.id === id ? updatedPermission : p))
      );
      return updatedPermission;
    } catch (err) {
      console.error("Error updating permission:", err);
      throw err;
    }
  };

  const deletePermission = async (id) => {
    if (id === 0) {
      return null;
    }
    try {
      const response = await fetch(`/api/permissions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete permission");
      }

      const deletedPermission = await response.json();
      setPermissions((prev) => prev.filter((p) => p.id !== id));
      return deletedPermission;
    } catch (err) {
      console.error("Error deleting permission:", err);
      throw err;
    }
  };

  const getPermissionById = async (id) => {
    try {
      const response = await fetch(`/api/permissions/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch permission");
      }

      const permission = await response.json();
      return permission;
    } catch (err) {
      console.error("Error fetching permission:", err);
      throw err;
    }
  };

  return {
    permissions,
    loading,
    error,
    createPermission,
    updatePermission,
    deletePermission,
    getPermissionById,
    fetchPermissions,
  };
};
