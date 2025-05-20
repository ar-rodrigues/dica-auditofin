import { useState, useEffect } from "react";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todos los usuarios (opcionalmente filtrados)
  const fetchUsers = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params).toString();
      const url = query ? `/api/users?${query}` : "/api/users";
      const response = await fetch(url);
      const result = await response.json();
      if (result.success) {
        setUsers(result.data || []);
        return result.data || [];
      } else {
        setError(result.message || "Error al obtener los usuarios");
        setUsers([]);
        return [];
      }
    } catch (err) {
      setError("Ocurrió un error al obtener los usuarios");
      setUsers([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Obtener un usuario por ID
  const getUserById = async (id) => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/${id}`);
      const result = await response.json();
      if (result.success) {
        return result;
      } else {
        setError(result.message || "Error al obtener el usuario");
        return result;
      }
    } catch (err) {
      setError("Ocurrió un error al obtener el usuario");
      return {
        success: false,
        error: "Ocurrió un error al obtener el usuario",
      };
    } finally {
      setLoading(false);
    }
  };

  // Crear un nuevo usuario
  const createUser = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchUsers();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al crear el usuario");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al crear el usuario");
      return {
        success: false,
        error: "Ocurrió un error al crear el usuario",
      };
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un usuario
  const updateUser = async (id, data) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        await fetchUsers();
        return { success: true, data: result.data };
      } else {
        setError(result.message || "Error al actualizar el usuario");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al actualizar el usuario");
      return {
        success: false,
        error: "Ocurrió un error al actualizar el usuario",
      };
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un usuario
  const deleteUser = async (id) => {
    if (!id) return { success: false, error: "ID requerido" };
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        await fetchUsers();
        return { success: true };
      } else {
        setError(result.message || "Error al eliminar el usuario");
        return { success: false, error: result.message };
      }
    } catch (err) {
      setError("Ocurrió un error al eliminar el usuario");
      return {
        success: false,
        error: "Ocurrió un error al eliminar el usuario",
      };
    } finally {
      setLoading(false);
    }
  };

  // Cargar los usuarios al montar el componente
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
