"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuditHeader from "@/components/AuditHeader";
import AuditStats from "@/components/common/AuditStats";
import AuditRequirementsTable from "@/components/common/AuditRequirementsTable";
import { useAtom } from "jotai";
import { mockRequirementsAtom, entitiesAtom } from "@/utils/atoms";

export default function EntityAuditPage({ params }) {
  const router = useRouter();
  const { entityId } = params;
  const [requirements] = useAtom(mockRequirementsAtom);
  const [entities] = useAtom(entitiesAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const entity = entities.entities.find((e) => e.id === entityId);

  const stats = {
    total: requirements.length,
    pending: requirements.filter((r) => r.status === "pending").length,
    approved: requirements.filter((r) => r.status === "approved").length,
    missing: requirements.filter((r) => r.status === "missing").length,
  };

  const handleRequirementClick = (requirementId) => {
    router.push(`/auditor/${entityId}/${requirementId}`);
  };

  if (!entity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Entity Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The entity you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/auditor")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Return to Entities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AuditHeader
        title={entity.name}
        subtitle="Audit requirements for this entity"
      />

      <div className="mt-8">
        <AuditStats stats={stats} />
      </div>

      <div className="mt-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <button
            onClick={() => router.push("/auditor")}
            className="mb-6 flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              ></path>
            </svg>
            Back to Entities
          </button>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              type="text"
              placeholder="Search requirements..."
              className="flex-1 px-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-lg"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="missing">Missing</option>
            </select>
          </div>

          <AuditRequirementsTable
            onRequirementClick={handleRequirementClick}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </div>
  );
}
