"use client";

import { useState, useEffect } from "react";
import { Spin, Layout } from "antd";

const { Content } = Layout;

export default function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Content className="p-4 sm:p-6 md:p-8">
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
              src="https://app.powerbi.com/view?r=eyJrIjoiNDM1YzNlOGUtZGExNS00NDkzLWJiNmYtNGVjZWM5ZTcyYjBkIiwidCI6Ijk2NDYyYWMzLTYwMzktNGE1YS1iYWI5LTBjMmY5YjNkYzFiYSJ9"
              allowFullScreen={true}
            ></iframe>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
