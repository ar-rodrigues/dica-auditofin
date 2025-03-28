import React from "react";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const StatCard = ({ title, value, icon, iconColor }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      {icon && (
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          {React.cloneElement(icon, {
            style: { fontSize: "24px", color: iconColor },
          })}
        </div>
      )}
    </div>
  </div>
);

const AuditStats = ({ stats, customIcons }) => {
  // Default icons and colors if not provided
  const defaultIcons = {
    total: {
      icon: <FileTextOutlined />,
      color: "#1890ff", // Blue
      title: "Total de Requerimientos",
    },
    pending: {
      icon: <ClockCircleOutlined />,
      color: "#faad14", // Yellow/Amber
      title: "Pendientes",
    },
    approved: {
      icon: <CheckCircleOutlined />,
      color: "#52c41a", // Green
      title: "Aprobados",
    },
    missing: {
      icon: <ExclamationCircleOutlined />,
      color: "#f5222d", // Red
      title: "Faltantes/Vencidos",
    },
  };

  // Merge default icons with custom icons if provided
  const icons = { ...defaultIcons, ...customIcons };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title={icons.total.title}
        value={stats.total}
        icon={icons.total.icon}
        iconColor={icons.total.color}
      />
      <StatCard
        title={icons.pending.title}
        value={stats.pending}
        icon={icons.pending.icon}
        iconColor={icons.pending.color}
      />
      <StatCard
        title={icons.approved.title}
        value={stats.approved}
        icon={icons.approved.icon}
        iconColor={icons.approved.color}
      />
      <StatCard
        title={icons.missing.title}
        value={stats.missing}
        icon={icons.missing.icon}
        iconColor={icons.missing.color}
      />
    </div>
  );
};

export default AuditStats;
