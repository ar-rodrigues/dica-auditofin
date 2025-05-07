"use client";

import { useState, useEffect } from "react";
import { Spin, Layout, Select, Typography, Card, Empty } from "antd";
const { Content } = Layout;
const { Option } = Select;
const { Title } = Typography;

import dynamic from "next/dynamic";

// Create a client-side only component that uses Power BI
const PowerBIReport = dynamic(
  () => import("@/components/Dashboard/Report/PowerBIReport"),
  {
    ssr: false,
    loading: () => (
      <div className="text-center py-4">
        <div className="text-gray-600">Cargando reporte...</div>
      </div>
    ),
  }
);

export default function PowerBIContent({ reports }) {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(reports[0]?.id);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleReportChange = (value) => {
    setIsLoading(true);
    setSelectedReport(value);
    setTimeout(() => setIsLoading(false), 800);
  };

  const currentReport =
    reports.find((report) => report?.id === selectedReport) || reports[0];

  if (!isLoading && (!reports || reports.length === 0)) {
    return (
      <div className="w-full overflow-x-hidden h-full flex flex-col">
        <div className="px-2 sm:px-4 py-4 sm:py-6 w-full flex-grow flex flex-col">
          <Card className="overflow-hidden shadow-sm border-0 flex flex-col flex-grow h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 mb-4 ml-2 mr-2">
              <Title level={4} className="m-0 text-gray-800">
                Dashboard
              </Title>
            </div>
            <div className="w-full bg-gray-50 rounded-lg overflow-hidden flex-grow px-0 sm:px-2">
              <div className="flex items-center justify-center h-full min-h-[calc(100vh-200px)]">
                <Empty
                  description={
                    <span className="text-gray-600">
                      No tienes acceso a ningún reporte en este momento. Por
                      favor, contacta al administrador si crees que deberías
                      tener acceso.
                    </span>
                  }
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden h-full flex flex-col">
      <div className="px-2 sm:px-4 py-4 sm:py-6 w-full flex-grow flex flex-col">
        <Card
          className="overflow-hidden shadow-sm border-0 flex flex-col flex-grow h-full"
          styles={{
            body: {
              padding: "0.5rem",
              "@media (minWidth: 640px)": {
                padding: "1rem",
              },
              height: "100%",
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4 mb-4 ml-2 mr-2">
            <Title level={4} className="m-0 text-gray-800">
              Dashboard
            </Title>
            <Select
              value={selectedReport}
              onChange={handleReportChange}
              className="md:w-fit sm:w-48"
              placeholder="Seleccionar Reporte"
              size="middle"
              variant="outlined"
              popupMatchSelectWidth={false}
            >
              {reports.map((report) => (
                <Option key={report?.id} value={report?.id}>
                  {report?.name}
                </Option>
              ))}
            </Select>
          </div>

          <div className="w-full bg-gray-50 rounded-lg overflow-hidden flex-grow px-0 sm:px-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-full min-h-[calc(100vh-200px)]">
                <Spin size="large">
                  <div className="p-6 text-center">
                    <p className="text-gray-500 mt-2">Cargando dashboard...</p>
                  </div>
                </Spin>
              </div>
            ) : (
              <div className="w-full h-full min-h-[calc(100vh-200px)] overflow-hidden">
                {currentReport?.iframeUrl ? (
                  <iframe
                    src={currentReport.iframeUrl}
                    title={currentReport.name || "Reporte"}
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "100%", minWidth: "100%" }}
                    sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation"
                    allowFullScreen
                  />
                ) : (
                  <PowerBIReport
                    id={currentReport?.id}
                    reportId={currentReport?.reportId}
                    iframeUrl={currentReport?.iframeUrl}
                  />
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
