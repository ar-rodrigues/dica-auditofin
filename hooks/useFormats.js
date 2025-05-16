import { useState } from "react";

export const useFormats = () => {
  const [formats, setFormats] = useState([]);
  const [format, setFormat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all formats
  const fetchFormats = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `/api/formats?${query}` : "/api/formats";
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setFormats(result.data || []);
        return result.data || [];
      } else {
        setError(result.message || "Error al obtener los formatos");
        setFormats([]);
        return [];
      }
    } catch (err) {
      setError("Ocurrió un error al obtener los formatos");
      setFormats([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch single format by ID
  const fetchFormat = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/formats/${id}`);
      const result = await response.json();
      if (result.success) {
        setFormat(result.data);
        return result;
      } else {
        setError(result.message || "Error al obtener el formato");
        setFormat(null);
        return result;
      }
    } catch (err) {
      setError("Ocurrió un error al obtener el formato");
      setFormat(null);
      return {
        success: false,
        error: "Ocurrió un error al obtener el formato",
      };
    } finally {
      setLoading(false);
    }
  };

  // Create new format
  const createFormat = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/formats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormats();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al crear el formato");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al crear el formato");
      return { success: false, error: "Ocurrió un error al crear el formato" };
    } finally {
      setLoading(false);
    }
  };

  // Update format
  const updateFormat = async (id, data) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/formats/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormats();
        if (format && format.id === id) setFormat(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al actualizar el formato");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al actualizar el formato");
      return {
        success: false,
        error: "Ocurrió un error al actualizar el formato",
      };
    } finally {
      setLoading(false);
    }
  };

  // Delete format
  const deleteFormat = async (id) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/formats/${id}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) {
        await fetchFormats();
        if (format && format.id === id) setFormat(null);
        return { success: true };
      } else {
        setError(result.message || "Error al eliminar el formato");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al eliminar el formato");
      return {
        success: false,
        error: "Ocurrió un error al eliminar el formato",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    formats,
    format,
    loading,
    error,
    fetchFormats,
    fetchFormat,
    createFormat,
    updateFormat,
    deleteFormat,
  };
};
