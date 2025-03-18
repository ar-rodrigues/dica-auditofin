import { useState, useEffect } from "react";

export const useRoles = () => {
  const [roles, setRoles] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await fetch("/api/roles");
      const data = await response.json();
      setRoles(data);
    };
    fetchRoles();
  }, []);

  return { roles, loading };
};
