"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AuditHeader from "@/components/AuditHeader";
import EntityCards from "@/components/common/EntityCards";
import { useAtom } from "jotai";
import { entitiesAtom } from "@/utils/atoms";

export default function AuditorPage() {
  const router = useRouter();
  const [entities] = useAtom(entitiesAtom);

  const handleEntityClick = (entityId) => {
    router.push(`/auditor/${entityId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AuditHeader
        title="Entities to Audit"
        subtitle="Select an entity to review their requirements"
      />

      <div className="mt-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Assigned Entities
          </h3>
          <EntityCards onEntityClick={handleEntityClick} />
        </div>
      </div>
    </div>
  );
}
