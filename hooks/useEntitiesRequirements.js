import { useState, useEffect } from "react";
import { useEntities } from "./useEntities";

export default function useEntitiesRequirements() {
  const { entities, loading: entitiesLoading } = useEntities();
  const [entitiesRequirements, setEntitiesRequirements] = useState([]);
  const [entityRequirement, setEntityRequirement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [groupedByEntity, setGroupedByEntity] = useState([]);

  // Fetch all entities requirements
  const fetchEntitiesRequirements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/entities-requirements");
      const result = await response.json();

      if (result.success) {
        setEntitiesRequirements(result.data || []);
        // Group will be done when both entities and requirements are loaded
      } else {
        setError(result.message || "Failed to fetch entities requirements");
        setEntitiesRequirements([]);
        setGroupedByEntity([]);
      }
    } catch (err) {
      setError("An error occurred while fetching entities requirements");
      console.error(err);
      setEntitiesRequirements([]);
      setGroupedByEntity([]);
    } finally {
      setLoading(false);
    }
  };

  // Group entities requirements by entity, including entities with no requirements
  const groupEntitiesByRequirements = () => {
    if (!entities || entities.length === 0) {
      return; // Wait for entities to load
    }

    try {
      // Create a map to hold entities and their requirements
      const entitiesMap = new Map();

      // First pass: add all entities from the entities list, even those with no requirements
      entities.forEach((entity) => {
        entitiesMap.set(entity.id, {
          ...entity,
          requirementsCount: 0,
          requirements: [],
        });
      });

      // Second pass: add requirements to each entity
      if (entitiesRequirements && entitiesRequirements.length > 0) {
        entitiesRequirements.forEach((item) => {
          if (!item.entity) return;

          const entityId =
            typeof item.entity === "object" ? item.entity.id : item.entity;
          const requirementData =
            typeof item.requirement === "object"
              ? item.requirement
              : { id: item.requirement, name: "Unknown Requirement" };

          if (entitiesMap.has(entityId)) {
            const entity = entitiesMap.get(entityId);
            entity.requirementsCount++;
            entity.requirements.push({
              ...item,
              requirement: requirementData,
            });
          }
        });
      }

      // Convert map to array
      const groupedEntities = Array.from(entitiesMap.values());
      setGroupedByEntity(groupedEntities);
    } catch (err) {
      console.error("Error grouping entities by requirements:", err);
      setGroupedByEntity([]);
    }
  };

  // Update grouping when either entities or entitiesRequirements changes
  useEffect(() => {
    if (!entitiesLoading && entities.length > 0) {
      groupEntitiesByRequirements();
    }
  }, [entities, entitiesRequirements, entitiesLoading]);

  // Manually trigger regrouping
  const regroupEntities = () => {
    groupEntitiesByRequirements();
  };

  // Fetch single entity requirement by ID
  const fetchEntityRequirement = async (id) => {
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/entities-requirements/${id}`);
      const result = await response.json();

      if (result.success) {
        setEntityRequirement(result.data);
      } else {
        setError(result.message || "Failed to fetch entity requirement");
        setEntityRequirement(null);
      }
    } catch (err) {
      setError("An error occurred while fetching the entity requirement");
      console.error(err);
      setEntityRequirement(null);
    } finally {
      setLoading(false);
    }
  };

  // Create new entity requirement
  const createEntityRequirement = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/entities-requirements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the list after creating
        await fetchEntitiesRequirements();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Failed to create entity requirement");
        return { success: false, error: result.message };
      }
    } catch (err) {
      const errorMessage =
        "An error occurred while creating the entity requirement";
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update entity requirement
  const updateEntityRequirement = async (id, data) => {
    if (!id) return { success: false, error: "ID is required" };

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/entities-requirements/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the list after updating
        await fetchEntitiesRequirements();
        if (entityRequirement && entityRequirement.id === id) {
          setEntityRequirement(result.data);
        }
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Failed to update entity requirement");
        return { success: false, error: result.message };
      }
    } catch (err) {
      const errorMessage =
        "An error occurred while updating the entity requirement";
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Delete entity requirement
  const deleteEntityRequirement = async (id) => {
    if (!id) return { success: false, error: "ID is required" };

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/entities-requirements/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        // Refresh the list after deleting
        await fetchEntitiesRequirements();
        // Clear the current entity if it's the one being deleted
        if (entityRequirement && entityRequirement.id === id) {
          setEntityRequirement(null);
        }
        return { success: true };
      } else {
        setError(result.message || "Failed to delete entity requirement");
        return { success: false, error: result.message };
      }
    } catch (err) {
      const errorMessage =
        "An error occurred while deleting the entity requirement";
      setError(errorMessage);
      console.error(err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Load entities requirements on component mount
  useEffect(() => {
    fetchEntitiesRequirements();
  }, []);

  return {
    entitiesRequirements,
    entityRequirement,
    loading: loading || entitiesLoading,
    error,
    groupedByEntity,
    fetchEntitiesRequirements,
    fetchEntityRequirement,
    createEntityRequirement,
    updateEntityRequirement,
    deleteEntityRequirement,
    regroupEntities,
  };
}
