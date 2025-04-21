"use client";

import { Typography, Form, message } from "antd";
import { useAtom } from "jotai";
import { loadingAtom } from "@/utils/atoms";
import EntityForm from "@/components/Entities/EntityForm";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NotFoundContent from "@/components/NotFoundContent";
import { useEntities } from "@/hooks/useEntities";
const { Title } = Typography;

export default function EditEntityPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useAtom(loadingAtom);
  const [entity, setEntity] = useState(null);
  const { updateEntity, loading: entityLoading } = useEntities();
  const params = useParams();
  const router = useRouter();
  const entityId = params.id;

  useEffect(() => {
    const fetchEntity = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/entities/${entityId}`);
        const data = await response.json();
        setEntity(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching entity:", error);
        setLoading(false);
      }
    };
    fetchEntity();
  }, [entityId, setLoading]);

  const handleSubmit = async (values) => {
    try {
      await updateEntity(entityId, values);
      message.success("Entidad actualizada exitosamente");
      router.push("/entities");
    } catch (error) {
      console.error("Error al actualizar la entidad:", error);
      message.error("Error al actualizar la entidad");
    }
  };

  if (!entity) {
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
            entity_name: entity.entity_name,
            is_active: entity.is_active,
            description: entity.description,
            entity_areas: entity.entity_areas || [],
          }}
          onSubmit={handleSubmit}
          form={form}
          loading={loading || entityLoading}
        />
      </div>
    </div>
  );
}
