import { useState, useEffect } from "react";

export default function useEntitiesRequirements() {
  const [entitiesRequirements, setEntitiesRequirements] = useState([]);
  const [entityRequirement, setEntityRequirement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all entities requirements
  const fetchEntitiesRequirements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/entities-requirements");
      const result = await response.json();

      if (result.success) {
        setEntitiesRequirements(result.data || []);
      } else {
        setError(result.message || "Failed to fetch entities requirements");
        setEntitiesRequirements([]);
      }
    } catch (err) {
      setError("An error occurred while fetching entities requirements");
      console.error(err);
      setEntitiesRequirements([]);
    } finally {
      setLoading(false);
    }
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
        // Refresh the list and the current entity after updating
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
    loading,
    error,
    fetchEntitiesRequirements,
    fetchEntityRequirement,
    createEntityRequirement,
    updateEntityRequirement,
    deleteEntityRequirement,
  };
}
