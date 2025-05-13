import React from "react";
import { useAtom } from "jotai";
import { entitiesAtom } from "@/utils/atoms";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Card, Avatar, Row, Col, Typography, Divider } from "antd";
import StatCard from "./StatCard";

const { Title, Text, Paragraph } = Typography;

// Colores consistentes para las estadísticas
const COLORS = {
  total: "#1890ff", // Azul
  pendiente: "#faad14", // Amarillo
  aprobado: "#52c41a", // Verde
  faltante: "#f5222d", // Rojo
};

const EntityCard = ({ entity, onClick }) => {
  // Si la entidad tiene estadísticas directamente, usarlas, de lo contrario calcular
  const stats = entity.stats || {
    total: entity.requirements?.length || 0,
    pendiente:
      entity.requirements?.filter((r) => r.status === "pendiente").length || 0,
    aprobado:
      entity.requirements?.filter((r) => r.status === "aprobado").length || 0,
    faltante:
      entity.requirements?.filter((r) => r.status === "faltante").length || 0,
  };

  const statConfig = [
    {
      title: "Total",
      value: stats.total,
      icon: <FileTextOutlined />,
      color: COLORS.total,
    },
    {
      title: "Pendientes",
      value: stats.pendiente,
      icon: <ClockCircleOutlined />,
      color: COLORS.pendiente,
    },
    {
      title: "Aprobados",
      value: stats.aprobado,
      icon: <CheckCircleOutlined />,
      color: COLORS.aprobado,
    },
    {
      title: "Faltantes",
      value: stats.faltante,
      icon: <ExclamationCircleOutlined />,
      color: COLORS.faltante,
    },
  ];

  return (
    <Card
      hoverable
      className="w-full transition-all duration-300 hover:shadow-lg"
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "16px",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-xs text-gray-500">
            REMEMBER TO REMOVE THIS COMPONENT FROM DASHBOARD/AUDITOR PAGE
          </h1>
        </div>
        <Avatar
          size={{ xs: 64, sm: 64, md: 72 }}
          icon={!entity.logo && <BankOutlined />}
          src={entity.logo || null}
          className="flex-shrink-0"
          style={{
            backgroundColor: !entity.logo ? COLORS.total : undefined,
            boxShadow: `0 0 0 2px ${COLORS.total}20`,
          }}
        />
        <div className="flex-grow overflow-hidden">
          <Title
            level={5}
            ellipsis={{ rows: 2 }}
            className="!mb-0 !text-base sm:!text-lg"
          >
            {entity.name}
          </Title>
          <Paragraph
            type="secondary"
            ellipsis={{ rows: 1 }}
            className="!mb-0 !text-xs sm:!text-sm opacity-80"
          >
            {entity.description}
          </Paragraph>
        </div>
      </div>

      <Divider className="my-3" />

      <div className="mt-auto">
        <Row gutter={[12, 12]}>
          {statConfig.map((stat, index) => (
            <Col xs={12} sm={6} md={6} lg={6} xl={6} key={index}>
              <StatCard
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                iconColor={stat.color}
                className="h-full"
              />
            </Col>
          ))}
        </Row>
      </div>
    </Card>
  );
};

const EntityCards = ({ onEntityClick, entities: providedEntities }) => {
  const [entitiesData] = useAtom(entitiesAtom);

  // Usar entidades proporcionadas por props o entidades del átomo
  const entities = providedEntities || entitiesData.entities;

  return (
    <Row gutter={[16, 16]} className="w-full">
      {entities.map((entity) => (
        <Col xs={24} sm={24} md={24} lg={24} xl={24} key={entity.id}>
          <EntityCard
            entity={entity}
            onClick={() => onEntityClick(entity.id)}
          />
        </Col>
      ))}
    </Row>
  );
};

export default EntityCards;
