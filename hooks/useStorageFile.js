import { useState } from "react";

export const useStorageFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createFile = async (file, bucket, fileName) => {
    setLoading(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("bucket", bucket);
      formData.append("file", file);
      formData.append("fileName", fileName);

      const response = await fetch("/api/storage", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error uploading file");
      }

      // Return the full URL of the uploaded file
      return data.url;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileUrl) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/storage?fileUrl=${encodeURIComponent(fileUrl)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error deleting file");
      }

      return data.success;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFile = async (file, fileUrl) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileUrl", fileUrl);

      const response = await fetch("/api/storage", {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error updating file");
      }

      return data.url;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createFile, deleteFile, updateFile, loading, error };
};
