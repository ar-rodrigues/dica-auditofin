import { useState, useEffect } from "react";

export const useEntities = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntities = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/entities");
      if (!response.ok) throw new Error("Failed to fetch entities");
      const data = await response.json();
      setEntities(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  const getEntityById = async (id) => {
    const response = await fetch(`/api/entities/${id}`);
    const data = await response.json();
    return data;
  };

  const createEntity = async (entityData) => {
    try {
      setLoading(true);
      const response = await fetch("/api/entities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entityData),
      });

      if (!response.ok) throw new Error("Failed to create entity");

      const newEntity = await response.json();
      setEntities((prev) => [...prev, newEntity]);
      setError(null);
      return newEntity;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEntity = async (id, entityData) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/entities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entityData),
      });

      if (!response.ok) throw new Error("Failed to update entity");

      const updatedEntity = await response.json();
      setEntities((prev) =>
        prev.map((entity) => (entity.id === id ? updatedEntity : entity))
      );
      setError(null);
      return updatedEntity;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEntity = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/entities/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete entity");

      setEntities((prev) => prev.filter((entity) => entity.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    entities,
    loading,
    error,
    createEntity,
    updateEntity,
    deleteEntity,
    getEntityById,
    refreshEntities: fetchEntities,
  };
};
