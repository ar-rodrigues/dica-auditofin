"use client";

import { useState, useEffect } from "react";
import { Spin, Result } from "antd";
import { useRouter } from "next/navigation";
import { useEntities } from "@/hooks/useEntities";
import EntityCardList from "@/components/Entity Requirements/EntityCardList";

export default function EntityFormatsPage() {
  const router = useRouter();
  const { entities, loading, error } = useEntities();

  const handleEntitySelect = (entity) => {
    router.push(`/entity-formats/${entity.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
        {loading ? (
          <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <Spin size="large" />
              <div className="mt-3 text-gray-600">Cargando entidades...</div>
            </div>
          </div>
        ) : error ? (
          <Result
            status="error"
            title="Error al cargar entidades"
            subTitle={error}
            className="bg-white rounded-lg shadow-sm"
          />
        ) : (
          <EntityCardList
            entities={entities}
            onEntitySelect={handleEntitySelect}
          />
        )}
      </div>
    </div>
  );
}
