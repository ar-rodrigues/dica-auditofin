import React, { useState } from "react";
import { useAtom } from "jotai";
import { mockRequirementsAtom } from "@/utils/atoms";

const RequirementDetails = ({
  requirementId,
  isAuditor,
  onApprove,
  onReject,
  onUpload,
}) => {
  const [requirements] = useAtom(mockRequirementsAtom);
  const [comment, setComment] = useState("");
  const requirement = requirements.find((req) => req.id === requirementId);

  // Format date string to avoid hydration issues
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const handleFileUpload = (file) => {
    if (onUpload && file) {
      onUpload(file);
    }
  };

  const handleSubmitComment = () => {
    console.log("Submitting comment:", comment);
    // In a real app, you would send the comment to your backend
    setComment("");
  };

  if (!requirement) return <div>Requirement not found</div>;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {requirement.ref_code}
            </h2>
            <p className="text-gray-600">{requirement.info}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <span
              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                requirement.status === "approved"
                  ? "bg-green-100 text-green-800"
                  : requirement.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {requirement.status.charAt(0).toUpperCase() +
                requirement.status.slice(1)}
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="block text-sm text-gray-500">Due Date</span>
            <span className="text-base font-medium">
              {formatDate(requirement.dueDate)}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="block text-sm text-gray-500">Required Format</span>
            <span className="text-base font-medium">
              {requirement.required_format.format}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="block text-sm text-gray-500">File Type</span>
            <span className="text-base font-medium">
              {requirement.file_type.type}
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="block text-sm text-gray-500">Created At</span>
            <span className="text-base font-medium">
              {formatDate(requirement.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">History</h3>
        {requirement.history && requirement.history.length > 0 ? (
          <div className="space-y-4">
            {requirement.history.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-start space-x-4 p-4 rounded-lg ${
                  index === 0
                    ? "bg-blue-50 border border-blue-100"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex-shrink-0">
                  {entry.type === "file" ? (
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {entry.user}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                  {entry.type === "file" ? (
                    <a
                      href={entry.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      <svg
                        className="mr-1 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View File
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-gray-600">
                      {entry.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
            No history available for this requirement.
          </div>
        )}
      </div>

      {/* Action Section */}
      <div className="bg-white rounded-lg border p-6">
        {isAuditor ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Review Submission
            </h3>
            {requirement.latestFile ? (
              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <svg
                    className="h-10 w-10 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <span className="block text-sm font-medium text-gray-900">
                      {requirement.latestFile.name}
                    </span>
                    <a
                      href={requirement.latestFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-900"
                    >
                      View Document
                    </a>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onApprove(requirement.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(requirement.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 text-center">
                No file has been uploaded yet for this requirement.
              </div>
            )}
            <div className="mt-4">
              <label
                htmlFor="auditor-comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Add a Comment
              </label>
              <textarea
                id="auditor-comment"
                placeholder="Add feedback or comments about this requirement..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleSubmitComment}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Submit Comment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Upload Document
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="mt-4 flex text-sm text-gray-600 justify-center">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {requirement.file_type.type} up to 10MB
              </p>
            </div>
            <div>
              <label
                htmlFor="auditee-comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Add a Comment
              </label>
              <textarea
                id="auditee-comment"
                placeholder="Add a comment or description for this upload..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={handleSubmitComment}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequirementDetails;
