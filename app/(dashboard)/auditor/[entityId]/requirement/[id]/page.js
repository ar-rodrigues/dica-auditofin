"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AuditHeader from "@/components/AuditHeader";
import RequirementDetails from "@/components/common/RequirementDetails";
import { useAtom } from "jotai";
import { mockRequirementsAtom, entitiesAtom } from "@/utils/atoms";
import { Spin, Button, Card, Divider, Alert, Layout, Typography } from "antd";
import { LoadingOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

export default function AuditorRequirementDetailPage({ params }) {
  // Usar React.use para unwrap params
  const unwrappedParams = React.use(params);
  const entityId = unwrappedParams.entityId;
  const id = unwrappedParams.id;

  const router = useRouter();
  const [requirements] = useAtom(mockRequirementsAtom);
  const [entitiesData] = useAtom(entitiesAtom);

  if (!entitiesData || !entitiesData.entities || !requirements) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          tip="Cargando datos..."
        />
      </div>
    );
  }

  const entity = entitiesData.entities.find((e) => e.id === entityId);

  // Buscar el requerimiento directamente desde el arreglo de requerimientos
  const requirement = requirements.find((req) => req.id === parseInt(id, 10));

  console.log("ID buscado:", id, "tipo:", typeof id);
  console.log("Tipo de ID parseado:", typeof parseInt(id, 10));
  console.log(
    "Requirements:",
    requirements.map((r) => ({ id: r.id, type: typeof r.id }))
  );

  const handleApprove = (id) => {
    // Mock approve functionality
    console.log("Aprobando requerimiento:", id);
    // In a real app, you would handle the approval process
    router.push(`/auditor/${entityId}`);
  };

  const handleReject = (id) => {
    // Mock reject functionality
    console.log("Rechazando requerimiento:", id);
    // In a real app, you would handle the rejection process
    router.push(`/auditor/${entityId}`);
  };

  if (!requirement || !entity) {
    return (
      <Layout className="bg-transparent">
        <Content className="px-4 py-6 sm:px-6 lg:px-8">
          <Card className="text-center">
            <Alert
              message={<Title level={4}>Requerimiento no encontrado</Title>}
              description={
                <>
                  <p className="mb-4">
                    El requerimiento que estás buscando no existe o ha sido
                    eliminado.
                  </p>
                  <div className="p-4 bg-gray-50 rounded mb-4 text-left">
                    <p>
                      <strong>ID buscado:</strong> {id}
                    </p>
                    <p>
                      <strong>Requerimientos disponibles:</strong>{" "}
                      {requirements.length}
                    </p>
                    <p>
                      <strong>IDs disponibles:</strong>{" "}
                      {requirements.map((r) => r.id).join(", ")}
                    </p>
                  </div>
                </>
              }
              type="error"
              showIcon
              className="mb-6"
            />

            <Button
              type="primary"
              onClick={() => router.push(`/auditor/${entityId}`)}
            >
              Volver a Requerimientos
            </Button>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="bg-transparent">
      <Content className="px-4 py-6 sm:px-6 lg:px-8">
        <AuditHeader
          title={`Auditoría: ${entity.name}`}
          subtitle={`Revisando: ${requirement.info}`}
        />

        <Card className="mt-6">
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push(`/auditor/${entityId}`)}
            className="mb-6"
          >
            Volver a Requerimientos
          </Button>

          <Divider />

          <RequirementDetails
            requirement={requirement}
            isAuditor={true}
            onApprove={() => handleApprove(requirement.id)}
            onReject={() => handleReject(requirement.id)}
          />
        </Card>
      </Content>
    </Layout>
  );
}
