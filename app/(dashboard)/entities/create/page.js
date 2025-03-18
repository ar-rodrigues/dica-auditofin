"use client";

import { Typography } from "antd";
import { useAtom } from "jotai";
import { loadingAtom, entitiesAtom } from "@/utils/atoms";
import EntityForm from "@/components/EntityForm";

const { Title } = Typography;

export default function CreateEntityPage() {
  const [, setLoading] = useAtom(loadingAtom);
  const [entitiesData, setEntitiesData] = useAtom(entitiesAtom);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // In a real application, you would make an API call here
      const newEntity = {
        ...values,
        id: entitiesData.entities.length + 1,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setEntitiesData({
        entities: [...entitiesData.entities, newEntity],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="!text-gray-600 mb-4">
          Crear Nueva Entidad
        </Title>

        <EntityForm
          mode="create"
          initialValues={{
            status: "active",
            type: "Municipal",
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
