import React from "react";
import { useAtom } from "jotai";
import { mockRequirementsAtom } from "@/utils/atoms";

const AuditRequirementsTable = ({
  onRequirementClick,
  searchTerm = "",
  filterStatus = "all",
}) => {
  const [requirements] = useAtom(mockRequirementsAtom);

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.ref_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.info.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "missing":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date string to avoid hydration issues
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return dateString;
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reference Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Requirement
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredRequirements.length > 0 ? (
            filteredRequirements.map((req) => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {req.ref_code}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-sm truncate">{req.info}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      req.status
                    )}`}
                  >
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(req.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => onRequirementClick(req.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                No requirements found matching your criteria
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AuditRequirementsTable;
