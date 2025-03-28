"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuditHeader from "@/components/AuditHeader";
import AuditStats from "@/components/common/AuditStats";
import AuditRequirementsTable from "@/components/common/AuditRequirementsTable";
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
    router.push(`/audit/${requirementId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AuditHeader
        title="My Requirements"
        subtitle="View and manage your requirements"
      />

      <div className="mt-8">
        <AuditStats stats={stats} />
      </div>

      <div className="mt-8">
        <div className="bg-white shadow-md rounded-lg p-6">
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
