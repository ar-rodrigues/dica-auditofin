import { useState, useEffect } from "react";

export const useFormSubmit = (route) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSubmit = async (values, id = null) => {
    setLoading(true);
    setError(null);

    const method = id ? "PUT" : "POST";
    const url = id ? `${route}/${id}` : route;
    const body = id
      ? JSON.stringify(values)
      : JSON.stringify({ ...values, id });

    try {
      const response = await fetch(url, {
        method,
        body,
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      setData(data);
    } catch (error) {
      console.error("Form submission error:", error);
      setError(error.message);
      throw error; // Re-throw to handle in the component
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error, data };
};
