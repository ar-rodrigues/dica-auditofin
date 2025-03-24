import { useState } from "react";

export const useUploadFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const uploadFile = async (file, bucket, path = "") => {
    setLoading(true);
    setError(null);

    try {
      // Create form data
      const formData = new FormData();
      const fileName = path ? `${path}/${file.name}` : file.name;
      formData.append("bucket", bucket);
      formData.append("file", file);
      formData.append("fileName", fileName);

      console.log("file", file);
      console.log("bucket", bucket);
      console.log("fileName", fileName);

      const response = await fetch("/api/storage", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error uploading file");
      }

      console.log("data", data);
      // Return the full URL of the uploaded file
      return data.url;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading, error };
};
