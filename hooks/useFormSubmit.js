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
      setData(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error, data };
};
