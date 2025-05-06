import React from "react";
import { Card, Typography, Avatar, Divider } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  StopOutlined,
  BankOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Colors for the stats
const COLORS = {
  total: "#1890ff", // Blue
  active: "#52c41a", // Green
  inactive: "#f5222d", // Red
};

const StatItem = ({ title, value, icon, color }) => (
  <div className="text-center">
    <div className="flex justify-center mb-2">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          backgroundColor: `${color}15`,
          boxShadow: `0 0 0 2px ${color}10`,
        }}
      >
        {React.cloneElement(icon, {
          style: {
            fontSize: "18px",
            color: color,
          },
        })}
      </div>
    </div>
    <Text className="text-xs block font-medium" style={{ color: `${color}99` }}>
      {title}
    </Text>
    <Title
      level={4}
      className="!m-0 !text-xl !font-bold"
      style={{ color: color }}
    >
      {value}
    </Title>
  </div>
);

const EntityCard = ({ entity, onClick }) => {
  // Calculate stats
  const totalRequirements = entity.requirementsCount || 0;
  const activeRequirements = entity.requirements
    ? entity.requirements.filter((req) => req.is_active).length
    : 0;
  const inactiveRequirements = totalRequirements - activeRequirements;

  // Get entity logo url
  const logoUrl = entity.entity_logo || null;

  return (
    <Card
      hoverable
      onClick={onClick}
      className="w-full transition-all duration-300 hover:shadow-sm hover:border-blue-200"
      styles={{
        body: {
          padding: "20px",
          background: "linear-gradient(135deg, white 30%, #1890ff10)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      }}
      style={{
        borderRadius: "12px",
        border: "1px solid #1890ff20",
        boxShadow: "0 2px 8px #1890ff10",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Decorative background effect */}
      <div
        className="absolute top-0 right-0 rounded-full opacity-10"
        style={{
          background: COLORS.total,
          width: "50px",
          height: "50px",
          transform: "translate(50%, -50%)",
          filter: "blur(15px)",
        }}
      ></div>

      <div className="flex items-start sm:items-center gap-5">
        <Avatar
          size={{ xs: 48, sm: 56, md: 64 }}
          icon={<BankOutlined />}
          src={logoUrl}
          className="flex-shrink-0 object-cover"
          style={{
            backgroundColor: !logoUrl ? COLORS.total : undefined,
            boxShadow: `0 0 0 2px ${COLORS.total}20`,
          }}
        />
        <div className="flex-1 min-w-0 pt-1">
          <Title level={4} className="!mb-0 !text-lg !leading-tight truncate">
            {entity.entity_name}
          </Title>
          <Text
            type="secondary"
            className="text-sm block truncate opacity-80 mt-1"
          >
            {entity.description || ""}
          </Text>
        </div>
      </div>

      <Divider className="my-4" />

      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        <StatItem
          title="Total"
          value={totalRequirements}
          icon={<FileTextOutlined />}
          color={COLORS.total}
        />
        <StatItem
          title="Activos"
          value={activeRequirements}
          icon={<CheckCircleOutlined />}
          color={COLORS.active}
        />
        <StatItem
          title="Inactivos"
          value={inactiveRequirements}
          icon={<StopOutlined />}
          color={COLORS.inactive}
        />
      </div>
    </Card>
  );
};

export default EntityCard;
