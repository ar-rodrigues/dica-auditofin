"use client";

import { useState, useEffect } from "react";

export default function useFileTypes() {
  const [fileTypes, setFileTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFileTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/file-types");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to fetch file types");
      }

      setFileTypes(result.data || []);
      return result.data;
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getFileTypeById = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/file-types/${id}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || `Failed to fetch file type with id ${id}`
        );
      }

      return result.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createFileType = async (fileType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/file-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fileType),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create file type");
      }

      await fetchFileTypes(); // Refresh the file types list
      return result.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateFileType = async (id, fileType) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/file-types/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fileType),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || `Failed to update file type with id ${id}`
        );
      }

      await fetchFileTypes(); // Refresh the file types list
      return result.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFileType = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/file-types/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(
          result.message || `Failed to delete file type with id ${id}`
        );
      }

      await fetchFileTypes(); // Refresh the file types list
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Load file types on component mount
  useEffect(() => {
    fetchFileTypes();
  }, []);

  return {
    fileTypes,
    isLoading,
    error,
    fetchFileTypes,
    getFileTypeById,
    createFileType,
    updateFileType,
    deleteFileType,
  };
}
