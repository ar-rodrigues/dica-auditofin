import { useState, useEffect } from "react";

export const useRoles = (userRole) => {
  const [roles, setRoles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getAll = userRole == "super admin";

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(`/api/roles?getAll=${getAll}`);
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, [getAll]);

  return { roles, loading, error };
};
