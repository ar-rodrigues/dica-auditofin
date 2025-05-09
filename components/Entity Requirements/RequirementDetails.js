import React from "react";
import { Typography, Tag, Space, Divider, Button } from "antd";
import { CheckOutlined, StopOutlined } from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const RequirementDetails = ({ requirement, onStatusChange, loading }) => {
  if (!requirement) return null;

  return (
    <div className="space-y-4">
      <div>
        <Text type="secondary" className="text-xs">
          Código
        </Text>
        <Paragraph strong className="text-lg mt-1">
          {requirement.requirement?.ref_code || ""}
        </Paragraph>
      </div>

      <Divider className="my-3" />

      <div>
        <Text type="secondary" className="text-xs">
          Información
        </Text>
        <Paragraph className="mt-1">
          {requirement.requirement?.required_information || ""}
        </Paragraph>
      </div>

      <div>
        <Text type="secondary" className="text-xs">
          Área
        </Text>
        <Paragraph className="mt-1">{requirement.area?.area || "-"}</Paragraph>
      </div>

      <div>
        <Text type="secondary" className="text-xs">
          Responsable del Área
        </Text>
        <Paragraph className="mt-1">
          {requirement.area?.responsable || "-"}
        </Paragraph>
      </div>

      <div>
        <Text type="secondary" className="text-xs">
          Tiempo de entrega
        </Text>
        <Paragraph className="mt-1">
          {requirement.requirement?.days_to_deliver || 0} días
        </Paragraph>
      </div>

      <div>
        <Text type="secondary" className="text-xs">
          Frecuencia por día
        </Text>
        <Paragraph className="mt-1">
          {requirement.requirement?.frequency_by_day || 0} veces
        </Paragraph>
      </div>

      <div>
        <Text type="secondary" className="text-xs">
          Tipo de archivo
        </Text>
        <div className="mt-1">
          {requirement.requirement?.file_type?.length > 0 ? (
            <Space size={[0, 4]} wrap>
              {requirement.requirement.file_type.map((type, index) => (
                <Tag key={index} color="blue">
                  {type.type}
                </Tag>
              ))}
            </Space>
          ) : (
            "-"
          )}
        </div>
      </div>

      <div>
        <Text type="secondary" className="text-xs">
          Estado
        </Text>
        <div className="mt-1">
          <Tag color={requirement.is_active ? "green" : "red"}>
            {requirement.is_active ? "Activo" : "Inactivo"}
          </Tag>
        </div>
      </div>

      <Divider className="my-3" />

      <Button
        type={requirement.is_active ? "default" : "primary"}
        danger={requirement.is_active}
        icon={requirement.is_active ? <StopOutlined /> : <CheckOutlined />}
        block
        onClick={() => onStatusChange?.(requirement)}
        loading={loading}
        className={`h-10 ${
          requirement.is_active
            ? "border-red-500 text-red-600 hover:bg-red-50"
            : "bg-green-600 hover:bg-green-700 border-green-600"
        }`}
      >
        {requirement.is_active
          ? "Desactivar requerimiento"
          : "Activar requerimiento"}
      </Button>
    </div>
  );
};

export default RequirementDetails;
