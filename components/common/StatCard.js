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
      className={`${className} overflow-hidden`}
      variant="outlined"
      style={{
        boxShadow: `0 2px 8px ${iconColor}10`,
        transition: "all 0.3s ease",
        padding: isMobile ? "2px" : "2px",
        borderRadius: "8px",
        background: `linear-gradient(135deg, white 30%, ${iconColor}10)`,
        border: `1px solid ${iconColor}20`,
        position: "relative",
        overflow: "hidden",
        minWidth: isMobile ? "5rem" : "10rem",
        maxWidth: isMobile ? "5rem" : "10rem",
      }}
    >
      {/* Efecto decorativo de fondo */}
      <div
        className="absolute top-0 right-0 rounded-full opacity-10"
        style={{
          background: iconColor,
          width: "28px",
          height: "28px",
          transform: "translate(50%, -50%)",
          filter: "blur(10px)",
        }}
      ></div>

      {isMobile ? (
        <div className="flex flex-col items-center justify-center text-center w-full">
          <Title
            level={5}
            className="!m-0 !text-base !font-bold"
            style={{ color: iconColor, fontSize: 18, lineHeight: 1.1 }}
          >
            {value}
          </Title>
          <Text
            className="text-[11px] font-medium block truncate"
            style={{ color: `${iconColor}99`, marginTop: 2 }}
          >
            {title}
          </Text>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded-full min-w-8 h-8"
            style={{
              backgroundColor: `${iconColor}15`,
              boxShadow: `0 0 0 2px ${iconColor}10`,
            }}
          >
            {React.cloneElement(icon, {
              style: {
                fontSize: "18px",
                color: iconColor,
              },
            })}
          </div>
          <div className="flex-grow min-w-0">
            <Text
              className="text-[12px] font-medium block truncate"
              style={{ color: `${iconColor}99` }}
            >
              {title}
            </Text>
            <Title
              level={5}
              className="!m-0 !text-base !font-bold truncate"
              style={{ color: iconColor }}
            >
              {value}
            </Title>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatCard;
