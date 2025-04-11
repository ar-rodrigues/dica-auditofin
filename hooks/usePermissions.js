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

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setLoading(true);
        setError(null);

        let url = "/api/permissions";
        const params = new URLSearchParams();

        if (userId) params.append("userId", userId);
        if (roleId) params.append("roleId", roleId);
        if (entityId) params.append("entityId", entityId);
        if (assetId) params.append("assetId", assetId);
        if (tableAsset) params.append("tableAsset", tableAsset);

        const queryString = params.toString();
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
      } catch (err) {
        setError(err.message);
        console.error("Error fetching permissions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [userId, roleId, entityId, assetId, tableAsset]);

  const createPermission = async (permissionData) => {
    if (permissionData.length === 0) {
      return null;
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
    if (permissionData.length === 0) {
      return null;
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

  return {
    permissions,
    loading,
    error,
    createPermission,
    updatePermission,
    deletePermission,
  };
};
