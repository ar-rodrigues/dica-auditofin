"use client";

import { Typography, Form, message, Skeleton } from "antd";
import EntityForm from "@/components/Entities/EntityForm";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NotFoundContent from "@/components/NotFoundContent";
import { useEntities } from "@/hooks/useEntities";
import { useEntitiesAreas } from "@/hooks/useEntitiesAreas";
import { useAuditorsForEntities } from "@/hooks/useAuditorsForEntities";
import { useUsers } from "@/hooks/useUsers";

const { Title } = Typography;

export default function EditEntityPage() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { users, loading: isUsersLoading } = useUsers();
  const {
    entities,
    refreshEntities,
    updateEntity,
    loading: isEntitiesLoading,
  } = useEntities();
  const {
    entitiesAreas,
    fetchEntitiesAreas,
    updateEntityArea,
    createEntityArea,
    deleteEntityArea,
    loading: isEntitiesAreasLoading,
  } = useEntitiesAreas();
  const {
    auditorsForEntities,
    fetchAuditorsForEntities,
    updateAuditorForEntity,
    createAuditorForEntity,
    deleteAuditorForEntity,
    loading: isAuditorLoading,
  } = useAuditorsForEntities();
  const params = useParams();
  const router = useRouter();
  const entityId = params.id;
  const auditorsFromEntities = ["Dica", "TKS Mexico"];

  // Find the current entity being edited
  const currentEntity = entities.find((entity) => entity.id === entityId);

  // Filter areas and auditors for the current entity
  const entityAreas = entitiesAreas.filter((area) => area.entity === entityId);
  const entityAuditors = auditorsForEntities.filter(
    (auditor) => auditor.entity.id === entityId
  );

  // Transform auditors data for the form
  const formattedAuditors = entityAuditors.map((auditor) => ({
    value: auditor.auditor.id,
    label: `${auditor.auditor.first_name} ${auditor.auditor.last_name} - Correo: ${auditor.auditor.email}`,
  }));

  // Filter users based on entity name (Dica or TKS)
  // TODO: This is a temporary solution,
  // we should add a tag to the users that are auditors and filter them by that
  const filteredUsers = users.filter((user) =>
    auditorsFromEntities.includes(user.entity.entity_name)
  );

  // Format users for the form dropdown
  const formattedUsers = filteredUsers.map((user) => ({
    value: user.id,
    label: `${user.first_name} ${user.last_name} - Correo: ${user.email}`,
  }));

  const handleSubmit = async (formValues) => {
    setIsSubmitting(true);
    const { entity_areas, ...entityData } = formValues;

    // Arrays to track changes
    const areasToDelete = [];
    const areasToCreate = [];
    const areasToUpdate = [];
    const auditorsToDelete = [];
    const auditorsToCreate = [];
    const auditorsToUpdate = [];

    // Get existing data
    const existingAreas = entitiesAreas.filter(
      (area) => area.entity === entityId
    );
    const existingAuditors = auditorsForEntities.filter(
      (auditor) => auditor.entity === entityId
    );

    // Identify areas to delete
    existingAreas.forEach((existingArea) => {
      const areaStillExists = entity_areas.some(
        (newArea) => newArea.id === existingArea.id
      );
      if (!areaStillExists) {
        areasToDelete.push(existingArea.id);
      }
    });

    // Identify auditors to delete
    existingAuditors.forEach((existingAuditor) => {
      const auditorStillExists = formValues.auditors.some(
        (newAuditor) => newAuditor === existingAuditor.auditor.id
      );
      if (!auditorStillExists) {
        auditorsToDelete.push(existingAuditor.id);
      }
    });

    // Process new areas
    entity_areas.forEach((newArea) => {
      if (newArea.id) {
        areasToUpdate.push({
          id: newArea.id,
          area: newArea.area,
          responsable: newArea.responsable,
          entity: entityId,
        });
      } else {
        areasToCreate.push({
          area: newArea.area,
          responsable: newArea.responsable,
          entity: entityId,
        });
      }
    });

    // Process new auditors
    formValues.auditors.forEach((newAuditorId) => {
      const existingAuditor = existingAuditors.find(
        (auditor) => auditor.auditor.id === newAuditorId
      );
      if (existingAuditor) {
        auditorsToUpdate.push({
          id: existingAuditor.id,
          entity: entityId,
          auditor: newAuditorId,
        });
      } else {
        auditorsToCreate.push({
          entity: entityId,
          auditor: newAuditorId,
        });
      }
    });

    try {
      // Update entity basic information
      const updatedEntity = await updateEntity(entityId, entityData);
      if (!updatedEntity) {
        throw new Error("Error al actualizar la entidad");
      }

      // Handle area changes
      if (areasToDelete.length > 0) {
        await Promise.all(areasToDelete.map((id) => deleteEntityArea(id)));
      }
      if (areasToCreate.length > 0) {
        await Promise.all(areasToCreate.map((area) => createEntityArea(area)));
      }
      if (areasToUpdate.length > 0) {
        await Promise.all(
          areasToUpdate.map((area) => updateEntityArea(area.id, area))
        );
      }

      // Handle auditor changes
      if (auditorsToDelete.length > 0) {
        await Promise.all(
          auditorsToDelete.map((id) => deleteAuditorForEntity(id))
        );
      }
      if (auditorsToCreate.length > 0) {
        await Promise.all(
          auditorsToCreate.map((auditor) => createAuditorForEntity(auditor))
        );
      }
      if (auditorsToUpdate.length > 0) {
        await Promise.all(
          auditorsToUpdate.map((auditor) =>
            updateAuditorForEntity(auditor.id, auditor)
          )
        );
      }

      message.success("Entidad actualizada exitosamente");
      router.push("/entities");
    } catch (error) {
      console.error("Error al actualizar la entidad:", error);
      message.error("Error al actualizar la entidad");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (
    isEntitiesLoading ||
    isEntitiesAreasLoading ||
    isSubmitting ||
    isAuditorLoading ||
    isUsersLoading ||
    users.length === 0
  ) {
    return <Skeleton active rows={10} />;
  }

  // Show not found state
  if (
    (!currentEntity || !entityAreas || !entityAuditors) &&
    !isSubmitting &&
    !isEntitiesLoading &&
    !isEntitiesAreasLoading
  ) {
    return (
      <NotFoundContent
        title="Entidad no encontrada"
        message="Lo sentimos, la entidad que estás buscando no existe o ha sido eliminada."
        buttonText="Volver atrás"
        buttonAction={() => window.history.back()}
        buttonStyles="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-6 rounded-md transition-colors"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="text-gray-600! mb-4">
          Editar Entidad
        </Title>

        <EntityForm
          mode="edit"
          initialValues={{
            entity_id: currentEntity.id,
            entity_name: currentEntity.entity_name,
            is_active: currentEntity.is_active,
            description: currentEntity.description,
            entity_areas: entityAreas,
            auditors: formattedAuditors,
          }}
          onSubmit={handleSubmit}
          form={form}
          users={formattedUsers}
          loading={
            isSubmitting ||
            isEntitiesLoading ||
            isEntitiesAreasLoading ||
            isAuditorLoading
          }
        />
      </div>
    </div>
  );
}
