import { useState, useEffect } from "react";
import { useFetchUser } from "./useFetchUser";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useFetchUser();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoading(true);
        if (user) {
          const response = await fetch(`/api/users/${user.id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user role");
          }

          const data = await response.json();

          setUserRole(data[0].role.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { userRole, loading };
};
