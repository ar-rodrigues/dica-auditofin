"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuditHeader from "@/components/AuditHeader";
import RequirementDetails from "@/components/common/RequirementDetails";
import { useAtom } from "jotai";
import { mockRequirementsAtom } from "@/utils/atoms";

export default function RequirementDetailPage({ params }) {
  const router = useRouter();
  const { requirementId } = params;
  const [requirements] = useAtom(mockRequirementsAtom);
  const requirement = requirements.find(
    (req) => req.id === parseInt(requirementId)
  );

  const handleUpload = (file) => {
    // Mock upload functionality
    console.log("Uploading file:", file);
    // In a real app, you would handle the file upload to your backend
  };

  if (!requirement) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Requirement Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The requirement you are looking for does not exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/audit")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Return to Requirements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AuditHeader
        title="Requirement Details"
        subtitle="View and manage this requirement"
      />

      <div className="mt-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <button
            onClick={() => router.push("/audit")}
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
            Back to Requirements
          </button>

          <RequirementDetails
            requirementId={parseInt(requirementId)}
            isAuditor={false}
            onUpload={handleUpload}
          />
        </div>
      </div>
    </div>
  );
}
