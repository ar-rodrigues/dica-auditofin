import React, { useState, useEffect } from "react";
import { Card, Typography } from "antd";

const { Text, Title } = Typography;

const StatCard = ({
  title,
  value,
  icon,
  iconColor,
  onClick,
  className = "",
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      className={`${className} overflow-hidden w-full`}
      variant="outlined"
      style={{
        boxShadow: `0 2px 8px ${iconColor}10`,
        transition: "all 0.3s ease",
        padding: isMobile ? "8px 4px" : "10px 12px",
        borderRadius: "8px",
        background: `linear-gradient(135deg, white 30%, ${iconColor}10)`,
        border: `1px solid ${iconColor}20`,
        position: "relative",
        overflow: "hidden",
        height: isMobile ? "auto" : "100%",
        padding: isMobile ? "4px" : "8px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {/* Efecto decorativo de fondo */}
      <div
        className="absolute top-0 right-0 rounded-full opacity-10"
        style={{
          background: iconColor,
          width: isMobile ? "16px" : "28px",
          height: isMobile ? "16px" : "28px",
          transform: "translate(50%, -50%)",
          filter: "blur(8px)",
        }}
      ></div>

      {isMobile ? (
        <div className="flex flex-col items-center justify-center text-center w-full">
          <Title
            level={5}
            className="!m-0 !font-bold"
            style={{ color: iconColor, fontSize: 24, lineHeight: 1.2 }}
          >
            {value}
          </Title>
          <Text
            className="font-medium block"
            style={{ color: iconColor, marginTop: 2, fontSize: 14 }}
          >
            {title}
          </Text>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 h-full">
          <div className="flex flex-col items-center justify-center text-center w-full">
            <Title
              level={5}
              className="!m-0 !font-bold"
              style={{ color: iconColor, fontSize: 22, lineHeight: 1.2 }}
            >
              {value}
            </Title>
            <Text
              className="font-medium block text-center"
              style={{ color: iconColor, marginTop: 2, fontSize: 14 }}
            >
              {title}
            </Text>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
