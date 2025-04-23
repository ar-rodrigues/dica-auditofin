import { useState, useEffect } from "react";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error fetching users");
      }
      const data = await response.json();
      setUsers(data);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch a single user by ID
  const getUserById = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error fetching user");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new user
  const createUser = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error creating user");
      }

      const data = await response.json();
      // Refresh users list after creating a new user
      await fetchUsers();
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a user
  const updateUser = async (id, userData) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error updating user");
      }

      const data = await response.json();
      // Update the local users state with the updated user
      setUsers(
        users.map((user) => (user.id === id ? { ...user, ...userData } : user))
      );
      return data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a user
  const deleteUser = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error deleting user");
      }

      const data = await response.json();
      // Remove the deleted user from the local state
      setUsers(users.filter((user) => user.id !== id));
      return data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
