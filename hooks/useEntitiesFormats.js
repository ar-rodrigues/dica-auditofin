import { useState, useEffect } from "react";

export const useEntitiesFormats = () => {
  const [entitiesFormats, setEntitiesFormats] = useState([]);
  const [entityFormat, setEntityFormat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los entities-formats (opcionalmente filtrados)
  const fetchEntitiesFormats = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const url = query
        ? `/api/entities-formats?${query}`
        : "/api/entities-formats";
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setEntitiesFormats(result.data || []);
        return result.data || [];
      } else {
        setError(result.message || "Error al obtener los formatos de entidad");
        setEntitiesFormats([]);
        return [];
      }
    } catch (err) {
      setError("Ocurrió un error al obtener los formatos de entidad");
      setEntitiesFormats([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener un entity-format por ID
  const fetchEntityFormat = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/entities-formats/${id}`);
      const result = await response.json();
      if (result.success) {
        setEntityFormat(result.data);
        return result;
      } else {
        setError(result.message || "Error al obtener el formato de entidad");
        setEntityFormat(null);
        return result;
      }
    } catch (err) {
      setError("Ocurrió un error al obtener el formato de entidad");
      setEntityFormat(null);
      return {
        success: false,
        error: "Ocurrió un error al obtener el formato de entidad",
      };
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo entity-format
  const createEntityFormat = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/entities-formats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchEntitiesFormats();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al crear el formato de entidad");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al crear el formato de entidad");
      return {
        success: false,
        error: "Ocurrió un error al crear el formato de entidad",
      };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un entity-format
  const updateEntityFormat = async (id, data) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/entities-formats/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchEntitiesFormats();
        if (entityFormat && entityFormat.id === id)
          setEntityFormat(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al actualizar el formato de entidad");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al actualizar el formato de entidad");
      return {
        success: false,
        error: "Ocurrió un error al actualizar el formato de entidad",
      };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un entity-format
  const deleteEntityFormat = async (id) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/entities-formats/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        await fetchEntitiesFormats();
        if (entityFormat && entityFormat.id === id) setEntityFormat(null);
        return { success: true };
      } else {
        setError(result.message || "Error al eliminar el formato de entidad");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al eliminar el formato de entidad");
      return {
        success: false,
        error: "Ocurrió un error al eliminar el formato de entidad",
      };
    } finally {
      setLoading(false);
    }
  };

  // Cargar los entities-formats al montar el componente
  useEffect(() => {
    fetchEntitiesFormats();
  }, []);

  return {
    entitiesFormats,
    entityFormat,
    loading,
    error,
    fetchEntitiesFormats,
    fetchEntityFormat,
    createEntityFormat,
    updateEntityFormat,
    deleteEntityFormat,
  };
};
