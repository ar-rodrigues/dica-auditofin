"use client";

import { useState, useEffect } from "react";
import { useEntities } from "./useEntities";

export const useAuditorsForEntities = () => {
  const { entities, loading: entitiesLoading } = useEntities();
  const [auditorsForEntities, setAuditorsForEntities] = useState([]);
  const [auditorForEntity, setAuditorForEntity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groupedByEntity, setGroupedByEntity] = useState([]);

  // Fetch all auditors for entities (optionally filtered)
  const fetchAuditorsForEntities = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Build query string from params
      const query = new URLSearchParams(params).toString();
      const url = query
        ? `/api/auditors-for-entities?${query}`
        : "/api/auditors-for-entities";
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setAuditorsForEntities(result.data || []);
        // Group will be done when both entities and auditors are loaded
        return result.data || [];
      } else {
        setError(result.message || "Failed to fetch auditors for entities");
        setAuditorsForEntities([]);
        setGroupedByEntity([]);
        return [];
      }
    } catch (err) {
      setError("An error occurred while fetching auditors for entities");
      setAuditorsForEntities([]);
      setGroupedByEntity([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Group auditors by entity, including entities with no auditors
  const groupAuditorsByEntity = () => {
    if (!entities || entities.length === 0) {
      return; // Wait for entities to load
    }

    try {
      // Create a map to hold entities and their auditors
      const entitiesMap = new Map();

      // First pass: add all entities from the entities list, even those with no auditors
      entities.forEach((entity) => {
        entitiesMap.set(entity.id, {
          ...entity,
          auditorsCount: 0,
          auditors: [],
        });
      });

      // Second pass: add auditors to each entity
      if (auditorsForEntities && auditorsForEntities.length > 0) {
        auditorsForEntities.forEach((item) => {
          if (!item.entity) return;

          const entityId =
            typeof item.entity === "object" ? item.entity.id : item.entity;
          const auditorData =
            typeof item.auditor === "object"
              ? item.auditor
              : { id: item.auditor, name: "Unknown Auditor" };

          if (entitiesMap.has(entityId)) {
            const entity = entitiesMap.get(entityId);
            entity.auditorsCount++;
            entity.auditors.push({
              ...item,
              auditor: auditorData,
            });
          }
        });
      }

      // Convert map to array
      const groupedEntities = Array.from(entitiesMap.values());
      setGroupedByEntity(groupedEntities);
    } catch (err) {
      console.error("Error grouping auditors by entity:", err);
      setGroupedByEntity([]);
    }
  };

  // Update grouping when either entities or auditorsForEntities changes
  useEffect(() => {
    if (!entitiesLoading && entities.length > 0) {
      groupAuditorsByEntity();
    }
  }, [entities, auditorsForEntities, entitiesLoading]);

  // Manually trigger regrouping
  const regroupAuditors = () => {
    groupAuditorsByEntity();
  };

  // Fetch single auditor for entity by ID
  const fetchAuditorForEntity = async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/auditors-for-entities/${id}`);
      const result = await response.json();

      if (result.success) {
        setAuditorForEntity(result.data);
      } else {
        setError(result.message || "Failed to fetch auditor for entity");
        setAuditorForEntity(null);
      }
    } catch (err) {
      setError("An error occurred while fetching the auditor for entity");
      console.error(err);
      setAuditorForEntity(null);
    } finally {
      setLoading(false);
    }
  };

  // Create new auditor for entity
  const createAuditorForEntity = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auditors-for-entities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the list after creating
        await fetchAuditorsForEntities();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Failed to create auditor for entity");
        return { success: false, error: result.message };
      }
    } catch (err) {
      const errorMessage =
        "An error occurred while creating the auditor for entity";
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update auditor for entity
  const updateAuditorForEntity = async (id, data) => {
    if (!id) return { success: false, error: "ID is required" };

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/auditors-for-entities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the list after updating
        await fetchAuditorsForEntities();
        if (auditorForEntity && auditorForEntity.id === id) {
          setAuditorForEntity(result.data);
        }
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Failed to update auditor for entity");
        return { success: false, error: result.message };
      }
    } catch (err) {
      const errorMessage =
        "An error occurred while updating the auditor for entity";
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete auditor for entity
  const deleteAuditorForEntity = async (id) => {
    if (!id) return { success: false, error: "ID is required" };

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/auditors-for-entities/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the list after deleting
        await fetchAuditorsForEntities();
        // Clear the current auditor if it's the one being deleted
        if (auditorForEntity && auditorForEntity.id === id) {
          setAuditorForEntity(null);
        }
        return { success: true };
      } else {
        setError(result.message || "Failed to delete auditor for entity");
        return { success: false, error: result.message };
      }
    } catch (err) {
      const errorMessage =
        "An error occurred while deleting the auditor for entity";
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Load auditors for entities on component mount
  useEffect(() => {
    fetchAuditorsForEntities();
  }, []);

  return {
    auditorsForEntities,
    auditorForEntity,
    loading: loading || entitiesLoading,
    error,
    groupedByEntity,
    fetchAuditorsForEntities,
    fetchAuditorForEntity,
    createAuditorForEntity,
    updateAuditorForEntity,
    deleteAuditorForEntity,
    regroupAuditors,
  };
};
