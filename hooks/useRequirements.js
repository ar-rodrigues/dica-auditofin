"use client";

import { useState, useEffect } from "react";

export default function useRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentRequirement, setCurrentRequirement] = useState(null);

  // Fetch all requirements
  const fetchRequirements = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/requirements");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch requirements");
      }

      if (result.success) {
        setRequirements(result.data);
        return result;
      } else {
        throw new Error(result.error || "Failed to fetch requirements");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching requirements:", err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a specific requirement by ID
  const fetchRequirementById = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/requirements/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `Failed to fetch requirement with id ${id}`
        );
      }

      if (result.success) {
        setCurrentRequirement(result.data);
        return result;
      } else {
        throw new Error(
          result.error || `Failed to fetch requirement with id ${id}`
        );
      }
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching requirement with id ${id}:`, err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new requirement
  const createRequirement = async (requirementData) => {
    setIsLoading(true);
    setError(null);

    // Ensure file_type is an array
    if (!requirementData.file_type) {
      requirementData.file_type = [];
    }

    try {
      const response = await fetch("/api/requirements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requirementData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create requirement");
      }

      if (result.success) {
        // Update the requirements list with the new requirement
        setRequirements((prevRequirements) => [
          ...prevRequirements,
          ...(result.data || []),
        ]);
        return result;
      } else {
        throw new Error(result.error || "Failed to create requirement");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error creating requirement:", err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing requirement
  const updateRequirement = async (id, requirementData) => {
    setIsLoading(true);
    setError(null);

    // Ensure file_type is an array
    if (!requirementData.file_type) {
      requirementData.file_type = [];
    }

    try {
      const response = await fetch(`/api/requirements/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requirementData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `Failed to update requirement with id ${id}`
        );
      }

      if (result.success) {
        // Update the requirements list with the updated requirement
        setRequirements((prevRequirements) =>
          prevRequirements.map((req) => (req.id === id ? result.data : req))
        );

        // If the current requirement is being updated, update it too
        if (currentRequirement && currentRequirement.id === id) {
          setCurrentRequirement(result.data);
        }

        return result;
      } else {
        throw new Error(
          result.error || `Failed to update requirement with id ${id}`
        );
      }
    } catch (err) {
      setError(err.message);
      console.error(`Error updating requirement with id ${id}:`, err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a requirement
  const deleteRequirement = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/requirements/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || `Failed to delete requirement with id ${id}`
        );
      }

      if (result.success) {
        // Remove the deleted requirement from the requirements list
        setRequirements((prevRequirements) =>
          prevRequirements.filter((req) => req.id !== id)
        );

        // If the current requirement is being deleted, reset it
        if (currentRequirement && currentRequirement.id === id) {
          setCurrentRequirement(null);
        }

        return result;
      } else {
        throw new Error(
          result.error || `Failed to delete requirement with id ${id}`
        );
      }
    } catch (err) {
      setError(err.message);
      console.error(`Error deleting requirement with id ${id}:`, err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Load requirements on initial render
  useEffect(() => {
    fetchRequirements();
  }, []);

  return {
    requirements,
    currentRequirement,
    isLoading,
    error,
    fetchRequirements,
    fetchRequirementById,
    createRequirement,
    updateRequirement,
    deleteRequirement,
    setCurrentRequirement,
  };
}
