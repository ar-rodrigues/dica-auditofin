"use client";

import { Typography, Form, message, Skeleton } from "antd";

import EntityForm from "@/components/Entities/EntityForm";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NotFoundContent from "@/components/NotFoundContent";
import { useEntities } from "@/hooks/useEntities";
import { useEntitiesAreas } from "@/hooks/useEntitiesAreas";
const { Title } = Typography;

export default function EditEntityPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const {
    entities,
    refreshEntities,
    updateEntity,
    loading: entitiesLoading,
  } = useEntities();
  const {
    entitiesAreas,
    fetchEntitiesAreas,
    updateEntityArea,
    createEntityArea,
    deleteEntityArea,
    loading: entitiesAreasLoading,
  } = useEntitiesAreas();
  const params = useParams();
  const router = useRouter();
  const entityId = params.id;

  const entity = entities.find((e) => e.id === entityId);
  // Filter areas for this entity
  const entityAreas = entitiesAreas.filter((a) => {
    return a.entity === entityId;
  });
  //console.log("entityAreas", entityAreas);

  const handleSubmit = async (values) => {
    setLoading(true);
    const { entity_areas, ...rest } = values;
    const areasToDelete = [];
    const areasToCreate = [];
    const areasToUpdate = [];

    // Get existing areas for this entity
    const existingAreas = entitiesAreas.filter((a) => a.entity === entityId);

    // Find areas to delete (exist in DB but not in form)
    existingAreas.forEach((existingArea) => {
      const stillExists = entity_areas.some(
        (newArea) => newArea.id === existingArea.id
      );
      if (!stillExists) {
        areasToDelete.push(existingArea.id);
      }
    });

    // Process new areas from form
    entity_areas.forEach((newArea) => {
      if (newArea.id) {
        // Area exists in DB - update it
        areasToUpdate.push({
          id: newArea.id,
          area: newArea.area,
          responsable: newArea.responsable,
          entity: entityId,
        });
      } else {
        // New area - create it
        areasToCreate.push({
          area: newArea.area,
          responsable: newArea.responsable,
          entity: entityId,
        });
      }
    });

    try {
      // Update entity basic info
      const updatedEntity = await updateEntity(entityId, rest);
      if (!updatedEntity) {
        throw new Error("Error al actualizar la entidad");
      }

      // Handle areas
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
    } catch (error) {
      console.error("Error al actualizar la entidad:", error);
      message.error("Error al actualizar la entidad");
      setLoading(false);
    } finally {
      setLoading(false);
      message.success("Entidad actualizada exitosamente");
      router.push("/entities");
    }
  };

  if (entitiesLoading || entitiesAreasLoading || loading) {
    return <Skeleton active rows={10} />;
  }

  if (
    (!entity || !entityAreas) &&
    !loading &&
    !entitiesLoading &&
    !entitiesAreasLoading
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
            entity_id: entity.id,
            entity_name: entity.entity_name,
            is_active: entity.is_active,
            description: entity.description,
            entity_areas: entityAreas,
          }}
          onSubmit={handleSubmit}
          form={form}
          loading={loading}
        />
      </div>
    </div>
  );
}
