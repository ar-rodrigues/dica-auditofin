"use client";

import { useRouter } from "next/navigation";
import { Typography, message } from "antd";
import RequirementForm from "@/components/Requirements/RequirementForm";
import { useRequirements } from "@/hooks/useRequirements";

const { Title } = Typography;

export default function CreateRequirementPage() {
  const router = useRouter();
  const { createRequirement, isLoading } = useRequirements();

  const handleSubmit = async (values) => {
    try {
      const result = await createRequirement(values);
      if (result.success) {
        message.success("Requerimiento creado exitosamente");
        router.push("/requirements");
      } else {
        throw new Error(result.error || "Error al crear el requerimiento");
      }
    } catch (error) {
      console.error("Error creating requirement:", error);
      message.error(error.message || "Error al crear el requerimiento");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 ">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="text-gray-600! mb-4">
          Crear Nuevo Requerimiento
        </Title>

        <RequirementForm
          mode="create"
          onSubmit={handleSubmit}
          loading={isLoading}
          initialValues={{
            ref_code: "",
            required_information: "",
            frequency_by_day: 31,
            days_to_deliver: 5,
            file_type: [],
          }}
        />
      </div>
    </div>
  );
}
