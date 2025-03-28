"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AuditHeader from "@/components/AuditHeader";
import EntityCards from "@/components/common/EntityCards";
import { useAtom } from "jotai";
import { entitiesAtom } from "@/utils/atoms";
import { Spin, Card, Typography, Layout, Divider } from "antd";
import { LoadingOutlined, AuditOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function AuditorPage() {
  const router = useRouter();
  const [entitiesData] = useAtom(entitiesAtom);

  const handleEntityClick = (entityId) => {
    router.push(`/auditor/${entityId}`);
  };

  if (!entitiesData || !entitiesData.entities) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          tip="Cargando entidades..."
        />
      </div>
    );
  }

  return (
    <Layout className="bg-transparent min-h-screen">
      <Content className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AuditHeader
            title="Entidades para Auditar"
            subtitle="Selecciona una entidad para revisar sus requerimientos"
          />

          <Card
            className="mt-6 w-full overflow-hidden shadow-md"
            style={{ padding: "24px" }}
          >
            <div className="flex items-center mb-4">
              <AuditOutlined
                className="text-blue-500 mr-3"
                style={{ fontSize: "24px" }}
              />
              <div>
                <Title level={4} className="!mb-0 !text-center sm:!text-left">
                  Entidades Asignadas
                </Title>
                <Paragraph type="secondary" className="!mb-0">
                  Selecciona una entidad para ver sus requerimientos de
                  auditoría
                </Paragraph>
              </div>
            </div>

            <Divider />

            <EntityCards onEntityClick={handleEntityClick} />
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
