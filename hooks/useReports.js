import { useState, useEffect } from "react";

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/reports/${id}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createReport = async (reportData) => {
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportData),
      });
      if (!response.ok) {
        throw new Error("Error al crear el reporte");
      }
      const newReport = await response.json();
      setReports((prevReports) => [...prevReports, newReport]);
      return newReport;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateReport = async (id, updateData) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar el reporte");
      }
      await fetchReports();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteReport = async (id) => {
    try {
      const response = await fetch(`/api/reports/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Error al eliminar el reporte");
      }
      await fetchReports();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return {
    reports,
    loading,
    error,
    fetchReports,
    fetchReportById,
    createReport,
    updateReport,
    deleteReport,
  };
}
