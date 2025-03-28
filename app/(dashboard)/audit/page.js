"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuditHeader from "@/components/AuditHeader";
import AuditStats from "@/components/common/AuditStats";
import AuditRequirementsTable from "@/components/common/AuditRequirementsTable";
import SearchAndFilters from "@/components/common/SearchAndFilters";
import { useAtom } from "jotai";
import { mockRequirementsAtom } from "@/utils/atoms";

export default function AuditPage() {
  const router = useRouter();
  const [requirements] = useAtom(mockRequirementsAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const stats = {
    total: requirements.length,
    pending: requirements.filter((r) => r.status === "pending").length,
    approved: requirements.filter((r) => r.status === "approved").length,
    missing: requirements.filter((r) => r.status === "missing").length,
  };

  const handleRequirementClick = (requirementId) => {
    router.push(`/audit/requirement/${requirementId}`);
  };

  // Define the status filter options
  const statusFilter = {
    id: "status",
    value: filterStatus,
    onChange: setFilterStatus,
    placeholder: "Filtrar por estado",
    options: [
      { value: "all", label: "Todos los estados" },
      { value: "approved", label: "Aprobados" },
      { value: "pending", label: "Pendientes" },
      { value: "missing", label: "Faltantes" },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <AuditHeader
          title="Mis Requerimientos"
          subtitle="Ver y gestionar tus requerimientos"
        />

        <div className="mt-8">
          <AuditStats stats={stats} />
        </div>

        <div className="mt-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <SearchAndFilters
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              searchPlaceholder="Buscar requerimientos..."
              filters={[statusFilter]}
            />

            <AuditRequirementsTable
              requirements={requirements}
              onRequirementClick={handleRequirementClick}
              filterStatus={filterStatus}
              searchTerm={searchTerm}
              buttonColor="var(--color-white)"
              buttonTextColor="var(--color-black)"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
