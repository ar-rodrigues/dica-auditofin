"use client";

import { useState, useEffect } from "react";
import { Spin, Layout, Select, Typography, Card } from "antd";

const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

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
    <div className="w-full overflow-x-hidden">
      <div className="px-4 py-6 w-full max-w-fit">
        <Card
          className="overflow-hidden shadow-sm border-0"
          styles={{ body: { padding: "1rem" } }}
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

          <div className="w-full bg-gray-50 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-[50vh] md:h-[60vh]">
                <Spin size="large">
                  <div className="p-6 text-center">
                    <p className="text-gray-500 mt-2">Cargando dashboard...</p>
                  </div>
                </Spin>
              </div>
            ) : (
              <div className="w-full h-[50vh] md:h-[60vh]">
                <iframe
                  title={currentDashboard.name}
                  className="w-full h-full rounded-lg border-0"
                  src={currentDashboard.url}
                  allowFullScreen={true}
                  style={{ maxWidth: "100%" }}
                ></iframe>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
