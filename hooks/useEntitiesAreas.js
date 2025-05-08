"use client";

import { useState, useEffect, useCallback } from "react";

export default function useEntitiesAreas() {
  const [entitiesAreas, setEntitiesAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntitiesAreas = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const url = query
        ? `/api/entities-areas?${query}`
        : "/api/entities-areas";
      const response = await fetch(url);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch entities areas");
      }

      setEntitiesAreas(result.data || []);
    } catch (err) {
      setError(err.message || "Error fetching entities areas");
      console.error("Error fetching entities areas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEntityAreaById = useCallback(async (id) => {
    if (!id) {
      throw new Error("Entity area ID is required");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/entities-areas/${id}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to fetch entity area");
      }

      return result.data;
    } catch (err) {
      setError(err.message || "Error fetching entity area");
      console.error(`Error fetching entity area ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEntityArea = useCallback(async (entityAreaData) => {
    if (!entityAreaData) {
      throw new Error("Entity area data is required");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/entities-areas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entityAreaData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to create entity area");
      }

      // Update the local state with the new entity area
      setEntitiesAreas((prevAreas) => [...prevAreas, ...result.data]);

      return result.data;
    } catch (err) {
      setError(err.message || "Error creating entity area");
      console.error("Error creating entity area:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEntityArea = useCallback(async (id, entityAreaData) => {
    if (!id) {
      throw new Error("Entity area ID is required");
    }

    if (!entityAreaData) {
      throw new Error("Entity area data is required");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/entities-areas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entityAreaData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to update entity area");
      }

      // Update the local state with the updated entity area
      setEntitiesAreas((prevAreas) =>
        prevAreas.map((area) =>
          area.id === id ? { ...area, ...result.data[0] } : area
        )
      );

      return result.data;
    } catch (err) {
      setError(err.message || "Error updating entity area");
      console.error(`Error updating entity area ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEntityArea = useCallback(async (id) => {
    if (!id) {
      throw new Error("Entity area ID is required");
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/entities-areas/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to delete entity area");
      }

      // Remove the deleted entity area from the local state
      setEntitiesAreas((prevAreas) =>
        prevAreas.filter((area) => area.id !== id)
      );

      return result.data;
    } catch (err) {
      setError(err.message || "Error deleting entity area");
      console.error(`Error deleting entity area ${id}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch entities areas on component mount
  useEffect(() => {
    fetchEntitiesAreas();
  }, [fetchEntitiesAreas]);

  return {
    entitiesAreas,
    loading,
    error,
    fetchEntitiesAreas,
    getEntityAreaById,
    createEntityArea,
    updateEntityArea,
    deleteEntityArea,
  };
}
