import { useState } from "react";

export const useFormatValues = () => {
  const [values, setValues] = useState([]);
  const [value, setValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all values
  const fetchFormatValues = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `/api/format-values?${query}` : "/api/format-values";
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setValues(result.data || []);
        return result.data || [];
      } else {
        setError(result.message || "Error al obtener los valores");
        setValues([]);
        return [];
      }
    } catch (err) {
      setError("Ocurrió un error al obtener los valores");
      setValues([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch single value by ID
  const fetchFormatValue = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/format-values/${id}`);
      const result = await response.json();
      if (result.success) {
        setValue(result.data);
      } else {
        setError(result.message || "Error al obtener el valor");
        setValue(null);
      }
    } catch (err) {
      setError("Ocurrió un error al obtener el valor");
      setValue(null);
    } finally {
      setLoading(false);
    }
  };

  // Create new value
  const createFormatValue = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/format-values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatValues();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al crear el valor");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al crear el valor");
      return { success: false, error: "Ocurrió un error al crear el valor" };
    } finally {
      setLoading(false);
    }
  };

  // Bulk insert values
  const bulkInsertFormatValues = async (valuesArray) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/format-values?bulk=1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valuesArray),
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatValues();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al insertar valores masivamente");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al insertar valores masivamente");
      return {
        success: false,
        error: "Ocurrió un error al insertar valores masivamente",
      };
    } finally {
      setLoading(false);
    }
  };

  // Update value
  const updateFormatValue = async (id, data) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/format-values/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatValues();
        if (value && value.id === id) setValue(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al actualizar el valor");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al actualizar el valor");
      return {
        success: false,
        error: "Ocurrió un error al actualizar el valor",
      };
    } finally {
      setLoading(false);
    }
  };

  // Delete value
  const deleteFormatValue = async (id) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/format-values/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatValues();
        if (value && value.id === id) setValue(null);
        return { success: true };
      } else {
        setError(result.message || "Error al eliminar el valor");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al eliminar el valor");
      return { success: false, error: "Ocurrió un error al eliminar el valor" };
    } finally {
      setLoading(false);
    }
  };

  // Bulk update values
  const bulkUpdateFormatValues = async (valuesArray) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/format-values?bulkupdate=1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valuesArray),
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatValues();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al actualizar valores masivamente");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al actualizar valores masivamente");
      return {
        success: false,
        error: "Ocurrió un error al actualizar valores masivamente",
      };
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete values
  const bulkDeleteFormatValues = async (idArray) => {
    if (!idArray || !Array.isArray(idArray) || idArray.length === 0) {
      return { success: false, error: "Se requiere un array de IDs válido" };
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/format-values?bulkdelete=1", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idArray }),
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatValues();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al eliminar valores masivamente");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al eliminar valores masivamente");
      return {
        success: false,
        error: "Ocurrió un error al eliminar valores masivamente",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    value,
    loading,
    error,
    fetchFormatValues,
    fetchFormatValue,
    createFormatValue,
    updateFormatValue,
    deleteFormatValue,
    bulkInsertFormatValues,
    bulkUpdateFormatValues,
    bulkDeleteFormatValues,
  };
};
