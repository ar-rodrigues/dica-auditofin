"use client";

import { useState, useEffect } from "react";
import { Spin, Layout, Select } from "antd";
import Script from "next/script";

const { Content } = Layout;
const { Option } = Select;

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
    // Add a small delay to show loading state when switching dashboards
    setTimeout(() => setIsLoading(false), 800);
  };

  const currentDashboard =
    dashboards.find((d) => d.id === selectedDashboard) || dashboards[0];

  return (
    <Layout className="h-[100vh] bg-gray-50">
      <Content className="p-4 sm:p-6 md:p-8 h-fit">
        <div className="w-full h-full bg-white rounded-lg shadow-md">
          <div className="p-4 border-b flex justify-start gap-4 items-center">
            <p className="text-gray-600 mb-2">
              Selecciona un tablero para visualizar:
            </p>
            <Select
              value={selectedDashboard}
              onChange={handleDashboardChange}
              className="w-full max-w-md"
              placeholder="Seleccionar Dashboard"
            >
              {dashboards.map((dashboard) => (
                <Option key={dashboard.id} value={dashboard.id}>
                  {dashboard.name}
                </Option>
              ))}
            </Select>
          </div>

          {isLoading && (
            <div className="w-full h-[calc(100vh-theme(spacing.32))] flex items-center justify-center">
              <Spin size="large">
                <div className="p-12 text-center">
                  <p className="text-gray-500 mt-3">Cargando dashboard...</p>
                </div>
              </Spin>
            </div>
          )}

          <div
            className={`w-full aspect-[3/2] min-h-[400px] relative ${
              isLoading ? "hidden" : ""
            }`}
          >
            <iframe
              title={currentDashboard.name}
              className="absolute top-0 left-0 w-full h-[80%] rounded-lg"
              src={currentDashboard.url}
              allowFullScreen={true}
              width={200}
              height={200}
            ></iframe>
          </div>
        </div>
      </Content>
      {/* <Script
        src="https://cdn.voiceflow.com/widget-next/bundle.mjs"
        type="text/javascript"
        strategy="afterInteractive"
        onLoad={() => {
          window.voiceflow.chat.load({
            verify: { projectID: "67b8c131e50f77be72ba5f9f" },
            url: "https://general-runtime.voiceflow.com",
            versionID: "production",
            voice: {
              url: "https://runtime-api.voiceflow.com",
            },
          });
        }}
      /> */}
    </Layout>
  );
}
