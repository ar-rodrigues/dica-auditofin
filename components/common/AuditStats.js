import React from "react";

const StatCard = ({ title, value, color }) => (
  <div className={`bg-white rounded-lg shadow p-4 ${color}`}>
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
  </div>
);

const AuditStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Requirements"
        value={stats.total}
        color="bg-blue-50"
      />
      <StatCard title="Pending" value={stats.pending} color="bg-yellow-50" />
      <StatCard title="Approved" value={stats.approved} color="bg-green-50" />
      <StatCard
        title="Missing/Overdue"
        value={stats.missing}
        color="bg-red-50"
      />
    </div>
  );
};

export default AuditStats;
