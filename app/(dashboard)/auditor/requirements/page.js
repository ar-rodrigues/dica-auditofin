"use client";

import { Typography, Card, Space } from "antd";
import { FaHammer } from "react-icons/fa";

const { Title, Text } = Typography;

export default function RequirementsPage() {
  return (
    <div className="p-6">
      <Card className="shadow-md">
        <Space direction="vertical" align="center" className="w-full py-8">
          <FaHammer style={{ fontSize: "64px", color: "#A2C224" }} />
          <Title level={2}>Página en Construcción</Title>
          <Text className="text-lg text-gray-600">
            Esta sección está actualmente en desarrollo. Pronto estará
            disponible.
          </Text>
        </Space>
      </Card>
    </div>
  );
}
