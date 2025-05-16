import { useState } from "react";

export const useFormatHeaders = () => {
  const [headers, setHeaders] = useState([]);
  const [header, setHeader] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all headers
  const fetchFormatHeaders = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const url = query
        ? `/api/format-headers?${query}`
        : "/api/format-headers";
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setHeaders(result.data || []);
        return result.data || [];
      } else {
        setError(result.message || "Error al obtener los encabezados");
        setHeaders([]);
        return [];
      }
    } catch (err) {
      setError("Ocurrió un error al obtener los encabezados");
      setHeaders([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch single header by ID
  const fetchFormatHeader = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/format-headers/${id}`);
      const result = await response.json();
      if (result.success) {
        setHeader(result.data);
      } else {
        setError(result.message || "Error al obtener el encabezado");
        setHeader(null);
      }
    } catch (err) {
      setError("Ocurrió un error al obtener el encabezado");
      setHeader(null);
    } finally {
      setLoading(false);
    }
  };

  // Create new header
  const createFormatHeader = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/format-headers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatHeaders();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al crear el encabezado");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al crear el encabezado");
      return {
        success: false,
        error: "Ocurrió un error al crear el encabezado",
      };
    } finally {
      setLoading(false);
    }
  };

  // Update header
  const updateFormatHeader = async (id, data) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/format-headers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatHeaders();
        if (header && header.id === id) setHeader(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al actualizar el encabezado");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al actualizar el encabezado");
      return {
        success: false,
        error: "Ocurrió un error al actualizar el encabezado",
      };
    } finally {
      setLoading(false);
    }
  };

  // Delete header
  const deleteFormatHeader = async (id) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/format-headers/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatHeaders();
        if (header && header.id === id) setHeader(null);
        return { success: true };
      } else {
        setError(result.message || "Error al eliminar el encabezado");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al eliminar el encabezado");
      return {
        success: false,
        error: "Ocurrió un error al eliminar el encabezado",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    headers,
    header,
    loading,
    error,
    fetchFormatHeaders,
    fetchFormatHeader,
    createFormatHeader,
    updateFormatHeader,
    deleteFormatHeader,
  };
};
