"use client";

import { useState, useEffect } from "react";
import { Spin, Result, message } from "antd";
import { useRouter } from "next/navigation";
import useEntitiesRequirements from "@/hooks/useEntitiesRequirements";
import EntityCardList from "@/components/entity-requirements/EntityCardList";
import RequirementsTable from "@/components/entity-requirements/RequirementsTable";

export default function EntityRequirementsPage() {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();
  const {
    groupedByEntity,
    loading,
    error,
    updateEntityRequirement,
    fetchEntitiesRequirements,
  } = useEntitiesRequirements();

  const handleEntitySelect = (entity) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedEntity(entity);
      setIsTransitioning(false);
    }, 300);
  };

  const handleStatusChange = async (requirement) => {
    if (!requirement || !requirement.id) return;

    // Only send the id and the toggled is_active property
    const updatedData = {
      is_active: !requirement.is_active,
    };

    try {
      const result = await updateEntityRequirement(requirement.id, updatedData);

      if (result.success) {
        // Update the local state to reflect the change immediately
        if (selectedEntity && selectedEntity.requirements) {
          // Create a new array to trigger re-render
          const updatedRequirements = selectedEntity.requirements.map((req) => {
            if (req.id === requirement.id) {
              // Toggle the is_active property in the local state
              return { ...req, is_active: !req.is_active };
            }
            return req;
          });

          // Update the selected entity with the new requirements
          setSelectedEntity({
            ...selectedEntity,
            requirements: updatedRequirements,
          });

          // Show a success message
          message.success(
            updatedData.is_active
              ? "Requerimiento activado"
              : "Requerimiento desactivado"
          );
        }
      } else {
        // Show error message
        message.error("Error al actualizar el estado del requerimiento");
      }
    } catch (err) {
      console.error("Failed to update requirement status:", err);
      message.error("Error al actualizar el estado del requerimiento");
    }
  };

  const handleGoBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      // Refresh data before going back to ensure list is updated
      fetchEntitiesRequirements().then(() => {
        setSelectedEntity(null);
        setIsTransitioning(false);
      });
    }, 300);
  };

  const handleAddRequirements = () => {
    if (selectedEntity) {
      router.push(
        `/requirements-assignment?entity=${selectedEntity.id}&edit=true`
      );
    }
  };

  useEffect(() => {
    // Add global CSS for transitions
    const style = document.createElement("style");
    style.textContent = `
      .page-transition-enter {
        opacity: 0;
        transform: translateY(20px);
      }
      .page-transition-enter-active {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 300ms, transform 300ms;
      }
      .page-transition-exit {
        opacity: 1;
      }
      .page-transition-exit-active {
        opacity: 0;
        transform: translateY(-20px);
        transition: opacity 300ms, transform 300ms;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <Spin size="large" />
              <div className="mt-3 text-gray-600">Cargando entidades...</div>
            </div>
          </div>
        ) : error ? (
          <Result
            status="error"
            title="Error al cargar entidades"
            subTitle={error}
            className="bg-white rounded-lg shadow-sm"
          />
        ) : (
          <div
            className={`transition-all duration-300 ${
              isTransitioning
                ? "opacity-0 transform translate-y-20"
                : "opacity-100 transform translate-y-0"
            }`}
          >
            {selectedEntity ? (
              <RequirementsTable
                entity={selectedEntity}
                onBack={handleGoBack}
                onStatusChange={handleStatusChange}
                onAddRequirements={handleAddRequirements}
              />
            ) : (
              <EntityCardList
                entities={groupedByEntity}
                onEntitySelect={handleEntitySelect}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
