"use client";

import { useState, useEffect } from "react";
import { Spin, Layout, Select, Typography, Card } from "antd";
const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

import dynamic from "next/dynamic";

// Create a client-side only component that uses Power BI
const PowerBIReport = dynamic(
  () => import("@/components/Report/PowerBIReport"),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-4">
        <div className="text-gray-600">Cargando reporte...</div>
      </div>
    ),
  }
);

export default function DashboardContent({ dashboards }) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDashboard, setSelectedDashboard] = useState(
    dashboards[0]?.id || ""
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDashboardChange = (value) => {
    setIsLoading(true);
    setSelectedDashboard(value);
    setTimeout(() => setIsLoading(false), 800);
  };

  const currentDashboard =
    dashboards.find((d) => d.id === selectedDashboard) || dashboards[0];

  return (
    <div className="w-full overflow-x-hidden h-full flex flex-col">
      <div className="px-4 py-6 w-full flex-grow flex flex-col">
        <Card
          className="overflow-hidden shadow-sm border-0 flex flex-col flex-grow h-full"
          styles={{
            body: {
              padding: "1rem",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <Title level={5} className="m-0 text-gray-800">
              Dashboard
            </Title>
            <Select
              value={selectedDashboard}
              onChange={handleDashboardChange}
              className="w-full md:w-64"
              placeholder="Seleccionar Dashboard"
              size="middle"
              variant="outlined"
              popupMatchSelectWidth={false}
            >
              {dashboards.map((dashboard) => (
                <Option key={dashboard.id} value={dashboard.id}>
                  {dashboard.name}
                </Option>
              ))}
            </Select>
          </div>

          <div className="w-full bg-gray-50 rounded-lg overflow-hidden flex-grow">
            {isLoading ? (
              <div className="flex items-center justify-center h-full min-h-[calc(100vh-200px)]">
                <Spin size="large">
                  <div className="p-6 text-center">
                    <p className="text-gray-500 mt-2">Cargando dashboard...</p>
                  </div>
                </Spin>
              </div>
            ) : (
              <div className="w-full h-full min-h-[calc(100vh-200px)]">
                <PowerBIReport />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
