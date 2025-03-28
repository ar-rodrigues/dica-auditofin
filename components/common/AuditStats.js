import React from "react";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import StatCard from "./StatCard";

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
    // Añadir soporte para los nombres en español
    pendiente: {
      icon: <ClockCircleOutlined />,
      color: "#faad14", // Yellow/Amber
      title: "Pendientes",
    },
    aprobado: {
      icon: <CheckCircleOutlined />,
      color: "#52c41a", // Green
      title: "Aprobados",
    },
    faltante: {
      icon: <ExclamationCircleOutlined />,
      color: "#f5222d", // Red
      title: "Faltantes/Vencidos",
    },
  };

  // Merge default icons with custom icons if provided
  const icons = { ...defaultIcons, ...customIcons };

  // Normalizar las estadísticas (aceptar tanto en inglés como en español)
  const normalizedStats = {
    total: stats.total || 0,
    pending: stats.pending || stats.pendiente || 0,
    approved: stats.approved || stats.aprobado || 0,
    missing: stats.missing || stats.faltante || 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title={icons.total.title}
        value={normalizedStats.total}
        icon={icons.total.icon}
        iconColor={icons.total.color}
      />
      <StatCard
        title={icons.pending.title}
        value={normalizedStats.pending}
        icon={icons.pending.icon}
        iconColor={icons.pending.color}
      />
      <StatCard
        title={icons.approved.title}
        value={normalizedStats.approved}
        icon={icons.approved.icon}
        iconColor={icons.approved.color}
      />
      <StatCard
        title={icons.missing.title}
        value={normalizedStats.missing}
        icon={icons.missing.icon}
        iconColor={icons.missing.color}
      />
    </div>
  );
};

export default AuditStats;
