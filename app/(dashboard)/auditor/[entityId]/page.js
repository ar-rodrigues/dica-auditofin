"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuditHeader from "@/components/common/AuditHeader";
import AuditStats from "@/components/common/AuditStats";
import AuditRequirementsTable from "@/components/common/AuditRequirementsTable";
import { useAtom } from "jotai";
import { mockRequirementsAtom, entitiesAtom } from "@/utils/atoms";
import {
  Spin,
  Button,
  Space,
  Input,
  Select,
  Card,
  Divider,
  Layout,
  Typography,
} from "antd";
import {
  LoadingOutlined,
  ArrowLeftOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title } = Typography;

export default function EntityAuditPage({ params }) {
  // Usar React.use para unwrap params
  const unwrappedParams = React.use(params);
  const entityId = unwrappedParams.entityId;

  const router = useRouter();
  const [requirements] = useAtom(mockRequirementsAtom);
  const [entitiesData] = useAtom(entitiesAtom);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  if (!entitiesData || !entitiesData.entities) {
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

  // Usar estadísticas proporcionadas por la entidad o calcularlas
  const stats = entity?.stats || {
    total: requirements.length,
    pendiente: requirements.filter((r) => r.status === "pendiente").length,
    aprobado: requirements.filter((r) => r.status === "aprobado").length,
    faltante: requirements.filter((r) => r.status === "faltante").length,
  };

  const handleRequirementClick = (requirementId) => {
    router.push(`/auditor/${entityId}/requirement/${requirementId}`);
  };

  if (!entity) {
    return (
      <Layout className="bg-transparent">
        <Content className="px-4 py-6 sm:px-6 lg:px-8">
          <Card className="text-center p-8">
            <Title level={3} className="mb-4">
              Entidad no encontrada
            </Title>
            <p className="text-gray-600 mb-6">
              La entidad que estás buscando no existe o ha sido eliminada.
            </p>
            <Button type="primary" onClick={() => router.push("/auditor")}>
              Volver a Entidades
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
          title={entity.name}
          subtitle="Requerimientos de auditoría para esta entidad"
        />

        <div className="mt-6">
          <AuditStats stats={stats} />
        </div>

        <Card className="mt-6">
          <Space className="mb-6">
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.push("/auditor")}
            >
              Volver a Entidades
            </Button>
          </Space>

          <Divider />

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Buscar requerimientos..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%" }}
              allowClear
            />
            <Select
              style={{ minWidth: 200 }}
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
            >
              <Select.Option value="all">Todos los estados</Select.Option>
              <Select.Option value="aprobado">Aprobados</Select.Option>
              <Select.Option value="pendiente">Pendientes</Select.Option>
              <Select.Option value="faltante">Faltantes</Select.Option>
            </Select>
          </div>

          <AuditRequirementsTable
            requirements={requirements}
            onRequirementClick={handleRequirementClick}
            filterStatus={filterStatus}
            searchTerm={searchTerm}
            buttonColor="var(--color-white)"
            buttonTextColor="var(--color-black)"
          />
        </Card>
      </Content>
    </Layout>
  );
}
