import React from "react";
import { Card, Typography, Tag, Row, Col, Divider, Space } from "antd";
import {
  ClockCircleOutlined,
  FileTextOutlined,
  FileOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const RequirementHeader = ({ requirement, formatDate }) => {
  const getStatusTag = (status) => {
    const statusMap = {
      aprobado: { color: "success", text: "Aprobado", value: "aprobado" },
      pendiente: { color: "warning", text: "Pendiente", value: "pendiente" },
      faltante: { color: "error", text: "Faltante", value: "faltante" },
    };

    const statusInfo = statusMap[status] || { color: "default", text: status };
    return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
  };

  return (
    <Card>
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} md={16}>
          <Title level={3} style={{ margin: 0 }}>
            {requirement.ref_code}
          </Title>
          <Paragraph
            ellipsis={{ rows: 3, expandable: true, symbol: "Ver más" }}
          >
            {requirement.info}
          </Paragraph>
        </Col>
        <Col xs={24} md={8} style={{ textAlign: "right" }}>
          {getStatusTag(requirement.status)}
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            title={
              <Space>
                <ClockCircleOutlined /> Fecha de vencimiento
              </Space>
            }
            style={{ height: "100%" }}
          >
            {formatDate(requirement.dueDate)}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            title={
              <Space>
                <FileTextOutlined /> Formato requerido
              </Space>
            }
            style={{ height: "100%" }}
          >
            {requirement.required_format.format}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            title={
              <Space>
                <FileOutlined /> Tipo de archivo
              </Space>
            }
            style={{ height: "100%" }}
          >
            {requirement.file_type.type}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            size="small"
            title={
              <Space>
                <CalendarOutlined /> Fecha de creación
              </Space>
            }
            style={{ height: "100%" }}
          >
            {formatDate(requirement.created_at)}
          </Card>
        </Col>
      </Row>
    </Card>
  );
};

export default RequirementHeader;
