"use client";

import { useState, useEffect } from "react";
import { Spin, Result, message } from "antd";
import { useRouter, useParams } from "next/navigation";
import { useEntities } from "@/hooks/useEntities";
import { useEntitiesRequirements } from "@/hooks/useEntitiesRequirements";
import RequirementsTable from "@/components/Entity Requirements/RequirementsTable";

export default function EntityRequirementsDetailPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [entity, setEntity] = useState(null);
  const [requirements, setRequirements] = useState([]);

  const { getEntityById, loading: entityLoading } = useEntities();
  const {
    entitiesRequirements,
    updateEntityRequirement,
    fetchEntitiesRequirements,
  } = useEntitiesRequirements();

  //console.log("requirements", requirements);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [entityData, requirementsData] = await Promise.all([
          getEntityById(id),
          fetchEntitiesRequirements({ entity: id }),
        ]);
        setEntity(entityData);
        setRequirements(requirementsData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Error al cargar los datos");
      }
    };
    loadData();
  }, [id]);

  const handleStatusChange = async (requirement) => {
    if (!requirement?.id) return;

    try {
      const result = await updateEntityRequirement(requirement.id, {
        is_active: !requirement.is_active,
      });

      if (result.success) {
        setRequirements((prevRequirements) =>
          prevRequirements.map((req) =>
            req.id === requirement.id
              ? { ...req, is_active: !req.is_active }
              : req
          )
        );
        message.success(
          requirement.is_active
            ? "Requerimiento desactivado"
            : "Requerimiento activado"
        );
      } else {
        message.error("Error al actualizar el estado del requerimiento");
      }
    } catch (err) {
      console.error("Failed to update requirement status:", err);
      message.error("Error al actualizar el estado del requerimiento");
    }
  };

  const handleGoBack = () => {
    router.push("/entity-requirements");
  };

  const handleAddRequirements = () => {
    if (entity) {
      router.push(`/entity-requirements/${entity.id}/assign`);
    }
  };

  if (!entity || loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <Spin size="large" />
              <div className="mt-3 text-gray-600">
                Cargando requerimientos...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <Result
            status="error"
            title="Error al cargar requerimientos"
            subTitle={error}
            className="bg-white rounded-lg shadow-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
        <RequirementsTable
          entity={entity}
          onBack={handleGoBack}
          onStatusChange={handleStatusChange}
          onAddRequirements={handleAddRequirements}
          requirements={requirements}
        />
      </div>
    </div>
  );
}
