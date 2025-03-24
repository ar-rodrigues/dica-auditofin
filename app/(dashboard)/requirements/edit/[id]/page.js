"use client";

import { Typography } from "antd";
import { useAtom, useAtomValue } from "jotai";
import { loadingAtom, mockRequirementsAtom } from "@/utils/atoms";
import RequirementForm from "@/components/RequirementForm";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NotFoundContent from "@/components/NotFoundContent";

const { Title } = Typography;

export default function EditRequirementPage() {
  const [loading, setLoading] = useAtom(loadingAtom);
  const requirements = useAtomValue(mockRequirementsAtom);
  const router = useRouter();
  const params = useParams();
  const requirementId = parseInt(params.id);

  // Find the requirement in mock data
  const requirement = requirements.find((req) => req.id === requirementId);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      console.log("Updating requirement:", values);
      router.push("/requirements");
    } catch (error) {
      console.error("Error updating requirement:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!requirement) {
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
        <Title level={5} className="!text-gray-600 mb-4">
          Editar Requerimiento
        </Title>

        <RequirementForm
          mode="edit"
          initialValues={{
            id: requirement.id,
            ref_code: requirement.ref_code,
            info: requirement.info,
            required_format: requirement.required_format.id,
            file_type: requirement.file_type.id,
            frequency_by_day: requirement.frequency_by_day,
            days_to_deliver: requirement.days_to_deliver,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
