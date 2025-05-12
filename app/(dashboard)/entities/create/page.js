"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Typography, Form, message } from "antd";
import EntityForm from "@/components/Entities/EntityForm";
import { useEntities } from "@/hooks/useEntities";
import { useAuditorsForEntities } from "@/hooks/useAuditorsForEntities";
import { useEntitiesAreas } from "@/hooks/useEntitiesAreas";
import { useUsers } from "@/hooks/useUsers";
const { Title } = Typography;

export default function CreateEntityPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { createEntity, deleteEntity, loading: entityLoading } = useEntities();
  const {
    createEntityArea,
    deleteEntityArea,
    updateEntityArea,
    loading: entityAreasLoading,
  } = useEntitiesAreas();
  const { users, loading: usersLoading } = useUsers();
  const {
    createAuditorForEntity,
    deleteAuditorForEntity,
    loading: auditorLoading,
  } = useAuditorsForEntities();

  const usersList = users.map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.last_name} - Correo: ${user.email}`,
  }));

  const handleSubmit = async (values) => {
    let createdEntity = null;
    try {
      // Separate areas and auditors from entity data
      const { entity_areas = [], auditors = [], ...entityData } = values;
      // 1. Create the entity (without areas and auditors)
      createdEntity = await createEntity(entityData);

      // 2. Create areas (if any)
      if (entity_areas.length > 0) {
        const areaPayloads = entity_areas.map((area) => ({
          ...area,
          entity: createdEntity.id,
        }));

        // 2.1. Create all areas in parallel
        const areaResponses = await Promise.all(
          areaPayloads.map((area) => createEntityArea(area))
        );
        // Check for any failed area creation
        const failedToCreateAreas = areaResponses.find((res) => !res.ok);
        if (failedToCreateAreas) {
          throw new Error("Error al crear las áreas de la entidad");
        }
      }

      // 3. Create the auditors for the entity (if any)
      if (auditors.length > 0) {
        const auditorPayloads = auditors.map((auditor) => ({
          entity: createdEntity.id,
          auditor: auditor,
        }));

        // 3.1. Create all auditors in parallel
        const auditorResponses = await Promise.all(
          auditorPayloads.map((auditor) => createAuditorForEntity(auditor))
        );
        // Check for any failed auditor creation
        const failedToCreateAuditors = auditorResponses.find((res) => !res.ok);
        if (failedToCreateAuditors) {
          throw new Error("Error al crear los auditores para la entidad");
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
          loading={
            entityLoading ||
            entityAreasLoading ||
            auditorLoading ||
            usersLoading
          }
          initialValues={{
            is_active: true,
            entity_areas: [],
            auditors: [],
            users: usersList,
          }}
        />
      </div>
    </div>
  );
}
