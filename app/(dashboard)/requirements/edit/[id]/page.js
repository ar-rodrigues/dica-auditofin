"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Typography, Spin, message } from "antd";
import RequirementForm from "@/components/Requirements/RequirementForm";
import useRequirements from "@/hooks/useRequirements";
import NotFoundContent from "@/components/NotFoundContent";

const { Title } = Typography;

export default function EditRequirementPage() {
  const router = useRouter();
  const params = useParams();
  const entityId = params.id;

  const [requirement, setRequirement] = useState(null);
  const [loading, setLoading] = useState(true);
  const { updateRequirement, isLoading } = useRequirements();

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/requirements/${entityId}`);
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "Error al cargar el requerimiento");
        }

        setRequirement(result.data);
      } catch (error) {
        console.error("Error fetching requirement:", error);
        message.error(error.message || "Error al cargar el requerimiento");
      } finally {
        setLoading(false);
      }
    };

    fetchRequirement();
  }, [entityId]);

  const handleSubmit = async (values) => {
    try {
      const result = await updateRequirement(entityId, values);
      if (result.success) {
        message.success("Requerimiento actualizado exitosamente");
        router.push("/requirements");
      } else {
        throw new Error(result.error || "Error al actualizar el requerimiento");
      }
    } catch (err) {
      console.error("Error updating requirement:", err);
      message.error(err.message || "Error al actualizar el requerimiento");
    }
  };

  if (loading && !requirement) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!loading && !requirement) {
    return (
      <NotFoundContent
        title="Requerimiento no encontrado"
        message="Lo sentimos, el requerimiento que estás buscando no existe o ha sido eliminado."
        buttonText="Volver atrás"
        buttonAction={() => router.push("/requirements")}
        buttonStyles="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-6 rounded-md transition-colors"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="text-gray-600! mb-4">
          Editar Requerimiento: {requirement?.ref_code}
        </Title>

        <RequirementForm
          mode="edit"
          initialValues={requirement}
          onSubmit={handleSubmit}
          loading={isLoading}
        />
      </div>
    </div>
  );
}
