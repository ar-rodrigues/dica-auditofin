"use client";

import { Typography } from "antd";
import { useAtom } from "jotai";
import { loadingAtom, entitiesAtom } from "@/utils/atoms";
import EntityForm from "@/components/EntityForm";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import NotFoundContent from "@/components/NotFoundContent";
const { Title } = Typography;

export default function EditEntityPage() {
  const [loading, setLoading] = useAtom(loadingAtom);
  const [entity, setEntity] = useState([]);
  const params = useParams();
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
    setLoading(true);
    try {
      // In a real application, you would make an API call here
      const updatedEntities = entitiesData.entities.map((e) =>
        e.id === entityId ? { ...e, ...values } : e
      );

      setEntitiesData({
        entities: updatedEntities,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!entity || entity.length === 0) {
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
        <Title level={5} className="!text-gray-600 mb-4">
          Editar Entidad
        </Title>

        <EntityForm
          mode="edit"
          initialValues={{
            id: entity.id,
            entity_name: entity.entity_name,
            is_active: entity.is_active,
            description: entity.description,
            entity_logo: entity.entity_logo,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
