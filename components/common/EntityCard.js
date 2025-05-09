import React from "react";
import { Card, Typography, Avatar } from "antd";
import { BankOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const COLORS = {
  primary: "#1890ff", // Blue
};

const EntityCard = ({
  entity,
  onClick,
  children,
  avatarIcon = <BankOutlined />,
}) => {
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
      <div
        className="absolute top-0 right-0 rounded-full opacity-10"
        style={{
          background: COLORS.primary,
          width: "50px",
          height: "50px",
          transform: "translate(50%, -50%)",
          filter: "blur(15px)",
        }}
      ></div>

      <div className="flex items-start sm:items-center gap-5">
        <Avatar
          size={{ xs: 48, sm: 56, md: 64 }}
          icon={avatarIcon}
          src={logoUrl}
          className="flex-shrink-0 object-cover"
          style={{
            backgroundColor: !logoUrl ? COLORS.primary : undefined,
            boxShadow: `0 0 0 2px ${COLORS.primary}20`,
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

      {children}
    </Card>
  );
};

export default EntityCard;
