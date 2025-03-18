"use client";

import { Typography } from "antd";
import { useAtom } from "jotai";
import { loadingAtom, entitiesAtom } from "@/utils/atoms";
import EntityForm from "@/components/EntityForm";
import { useParams } from "next/navigation";

const { Title } = Typography;

export default function EditEntityPage() {
  const [, setLoading] = useAtom(loadingAtom);
  const [entitiesData, setEntitiesData] = useAtom(entitiesAtom);
  const params = useParams();
  const entityId = parseInt(params.id);

  const entity = entitiesData.entities.find((e) => e.id === entityId);

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

  if (!entity) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="mx-auto flex flex-col">
          <Title level={5} className="!text-gray-600 mb-4">
            Entidad no encontrada
          </Title>
        </div>
      </div>
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
            name: entity.name,
            type: entity.type,
            location: entity.location,
            status: entity.status,
            lastAudit: entity.lastAudit,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
