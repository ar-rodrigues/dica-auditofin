"use client";

import { Typography, Form, message } from "antd";
import EntityForm from "@/components/Entities/EntityForm";
import { useEntities } from "@/hooks/useEntities";
import { useState } from "react";
import { useRouter } from "next/navigation";
const { Title } = Typography;

export default function CreateEntityPage() {
  const [form] = Form.useForm();
  const { createEntity, loading: entityLoading } = useEntities();
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      const newEntity = {
        ...values,
      };

      await createEntity(newEntity);
      message.success("Entidad creada exitosamente");
      router.push("/entities");
    } catch (error) {
      console.error("Error al crear la entidad:", error);
      message.error("Error al crear la entidad");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="text-gray-600! mb-4">
          Crear Nueva Entidad
        </Title>

        <EntityForm
          mode="create"
          onSubmit={handleSubmit}
          form={form}
          loading={entityLoading}
        />
      </div>
    </div>
  );
}
