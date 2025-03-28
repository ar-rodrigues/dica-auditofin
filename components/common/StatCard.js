import React from "react";
import { Card, Typography } from "antd";

const { Text, Title } = Typography;

const StatCard = ({
  title,
  value,
  icon,
  iconColor,
  onClick,
  className = "",
}) => (
  <Card
    hoverable={!!onClick}
    onClick={onClick}
    className={`${className} overflow-hidden`}
    variant="outlined"
    style={{
      boxShadow: `0 2px 8px ${iconColor}10`,
      transition: "all 0.3s ease",
      padding: "8px",
      height: "100%",
      borderRadius: "8px",
      background: `linear-gradient(135deg, white 30%, ${iconColor}10)`,
      border: `1px solid ${iconColor}20`,
      position: "relative",
      overflow: "hidden",
    }}
    bodyStyle={{ padding: 0 }}
  >
    {/* Efecto decorativo de fondo */}
    <div
      className="absolute top-0 right-0 rounded-full opacity-10"
      style={{
        background: iconColor,
        width: "40px",
        height: "40px",
        transform: "translate(50%, -50%)",
        filter: "blur(12px)",
      }}
    ></div>

    <div className="flex items-center gap-2">
      {/* Icono para todos los tamaños de pantalla */}
      <div
        className="flex items-center justify-center rounded-full min-w-8 h-8 sm:min-w-10 sm:h-10"
        style={{
          backgroundColor: `${iconColor}15`,
          boxShadow: `0 0 0 2px ${iconColor}10`,
        }}
      >
        {React.cloneElement(icon, {
          style: {
            fontSize: "15px",
            color: iconColor,
          },
        })}
      </div>

      <div className="flex-grow min-w-0">
        <Text
          className="text-xs font-medium block truncate"
          style={{ color: `${iconColor}99` }}
        >
          {title}
        </Text>
        <Title
          level={4}
          className="!m-0 !text-lg !font-bold truncate"
          style={{ color: iconColor }}
        >
          {value}
        </Title>
      </div>
    </div>
  </Card>
);

export default StatCard;
