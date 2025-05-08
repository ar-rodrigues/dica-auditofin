"use client";

import { Typography, Form, message } from "antd";
import EntityForm from "@/components/Entities/EntityForm";
import { useEntities } from "@/hooks/useEntities";
import { useState } from "react";
import { useRouter } from "next/navigation";
const { Title } = Typography;

export default function CreateEntityPage() {
  const [form] = Form.useForm();
  const { createEntity, deleteEntity, loading: entityLoading } = useEntities();
  const router = useRouter();

  const handleSubmit = async (values) => {
    let createdEntity = null;
    try {
      // Separate areas from entity data
      const { entity_areas = [], ...entityData } = values;
      // 1. Create the entity (without areas)
      createdEntity = await createEntity(entityData);
      // 2. Create areas (if any)
      if (entity_areas.length > 0) {
        const areaPayloads = entity_areas.map((area) => ({
          ...area,
          entity: createdEntity.id,
        }));
        // Create all areas in parallel
        const responses = await Promise.all(
          areaPayloads.map((area) =>
            fetch("/api/entities-areas", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(area),
            })
          )
        );
        // Check for any failed area creation
        const failed = responses.find((res) => !res.ok);
        if (failed) {
          throw new Error("Error al crear las áreas de la entidad");
        }
      }
      message.success("Entidad creada exitosamente");
      router.push("/entities");
    } catch (error) {
      // If error, delete the entity if it was created
      if (createdEntity?.id) {
        await deleteEntity(createdEntity.id);
      }
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
