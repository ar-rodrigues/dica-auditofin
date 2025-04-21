import { useState, useEffect } from "react";

const useDocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDocumentTypes = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/document-types");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch document types");
      }

      setDocumentTypes(result.data || []);
      return result;
    } catch (err) {
      setError(
        err.message || "An error occurred while fetching document types"
      );
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getDocumentTypeById = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/document-types/${id}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch document type");
      }

      return result;
    } catch (err) {
      setError(err.message || "An error occurred while fetching document type");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const createDocumentType = async (documentType) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/document-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentType),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create document type");
      }

      // Refresh the document types list
      await fetchDocumentTypes();

      return result;
    } catch (err) {
      setError(err.message || "An error occurred while creating document type");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateDocumentType = async (id, documentType) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/document-types/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentType),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to update document type");
      }

      // Refresh the document types list
      await fetchDocumentTypes();

      return result;
    } catch (err) {
      setError(err.message || "An error occurred while updating document type");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteDocumentType = async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/document-types/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete document type");
      }

      // Refresh the document types list
      await fetchDocumentTypes();

      return result;
    } catch (err) {
      setError(err.message || "An error occurred while deleting document type");
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Initial load of document types
  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  return {
    documentTypes,
    loading,
    error,
    fetchDocumentTypes,
    getDocumentTypeById,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType,
  };
};

export default useDocumentTypes;
