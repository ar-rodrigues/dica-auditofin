import { useState, useEffect } from "react";

export const useEntities = () => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntities = async () => {
      const response = await fetch("/api/entities");
      const data = await response.json();
      setEntities(data);
      setLoading(false);
    };
    fetchEntities();
  }, []);

  return { entities, loading };
};
