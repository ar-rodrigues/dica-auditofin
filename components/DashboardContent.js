"use client";

import { useState, useEffect } from "react";
import { Spin, Layout } from "antd";
import Script from "next/script";

const { Content } = Layout;

export default function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true);
  const urlDashboard =
    "https://app.powerbi.com/view?r=eyJrIjoiZTI2NmE1ZGMtNmZhNy00NTFhLWE3MjEtZDJlY2UyODA2ZmFjIiwidCI6Ijk2NDYyYWMzLTYwMzktNGE1YS1iYWI5LTBjMmY5YjNkYzFiYSJ9&pageName=8ae6bf7bf1366a5a9756";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout className="h-[100vh] bg-gray-50">
      <Content className="p-4 sm:p-6 md:p-8 h-fit">
        <div className="w-full h-full bg-white rounded-lg shadow-md">
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
              title="DICA_dashboard_xalapa_demo"
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={urlDashboard}
              allowFullScreen={true}
              width={300}
              height={300}
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
