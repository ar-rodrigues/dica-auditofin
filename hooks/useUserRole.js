import { useState, useEffect } from "react";
import { useFetchUser } from "./useFetchUser";

export const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useFetchUser();

  //console.log("hook", userRole);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        setLoading(true);
        if (user) {
          const response = await fetch(`/api/users/${user.id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch user role");
          }

          const result = await response.json();
          if (result && result.success && result.data && result.data.role) {
            setUserRole(result.data.role.role);
          } else {
            setUserRole(null);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  return { userRole, loading };
};
