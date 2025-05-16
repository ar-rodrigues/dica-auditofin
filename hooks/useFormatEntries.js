import { useState } from "react";

export const useFormatEntries = () => {
  const [entries, setEntries] = useState([]);
  const [entry, setEntry] = useState(null);
  const [excelData, setExcelData] = useState({ data: [], headers: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all entries
  const fetchFormatEntries = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const url = query
        ? `/api/format-entries?${query}`
        : "/api/format-entries";
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setEntries(result.data || []);
        return result.data || [];
      } else {
        setError(result.message || "Error al obtener las entradas");
        setEntries([]);
        return [];
      }
    } catch (err) {
      setError("Ocurrió un error al obtener las entradas");
      setEntries([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Fetch single entry by ID
  const fetchFormatEntry = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/format-entries/${id}`);
      const result = await response.json();
      if (result.success) {
        setEntry(result.data);
      } else {
        setError(result.message || "Error al obtener la entrada");
        setEntry(null);
      }
    } catch (err) {
      setError("Ocurrió un error al obtener la entrada");
      setEntry(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch entries as Excel-like data
  const fetchFormatEntriesExcel = async (format_id) => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/format-entries?excel=1&format_id=${format_id}`;
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setExcelData({ data: result.data, headers: result.headers });
        return { data: result.data, headers: result.headers };
      } else {
        setError(result.message || "Error al obtener datos tipo Excel");
        setExcelData({ data: [], headers: [] });
        return { data: [], headers: [] };
      }
    } catch (err) {
      setError("Ocurrió un error al obtener datos tipo Excel");
      setExcelData({ data: [], headers: [] });
      return { data: [], headers: [] };
    } finally {
      setLoading(false);
    }
  };

  // Create new entry
  const createFormatEntry = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/format-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatEntries();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al crear la entrada");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al crear la entrada");
      return { success: false, error: "Ocurrió un error al crear la entrada" };
    } finally {
      setLoading(false);
    }
  };

  // Update entry
  const updateFormatEntry = async (id, data) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/format-entries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatEntries();
        if (entry && entry.id === id) setEntry(result.data);
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al actualizar la entrada");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al actualizar la entrada");
      return {
        success: false,
        error: "Ocurrió un error al actualizar la entrada",
      };
    } finally {
      setLoading(false);
    }
  };

  // Delete entry
  const deleteFormatEntry = async (id) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/format-entries/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        await fetchFormatEntries();
        if (entry && entry.id === id) setEntry(null);
        return { success: true };
      } else {
        setError(result.message || "Error al eliminar la entrada");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al eliminar la entrada");
      return {
        success: false,
        error: "Ocurrió un error al eliminar la entrada",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    entries,
    entry,
    excelData,
    loading,
    error,
    fetchFormatEntries,
    fetchFormatEntry,
    createFormatEntry,
    updateFormatEntry,
    deleteFormatEntry,
    fetchFormatEntriesExcel,
  };
};
