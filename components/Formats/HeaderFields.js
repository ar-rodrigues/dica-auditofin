import React from "react";
import { Row, Col, Input, Select, Button, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const dataTypes = [
  { label: "Texto", value: "string" },
  { label: "Número", value: "number" },
  { label: "Fecha", value: "date" },
  { label: "Booleano", value: "boolean" },
];

const HeaderFields = ({ headers, onChange, onRemove }) => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      {headers.map((header, idx) => (
        <Row gutter={8} key={idx} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Nombre del encabezado"
              value={header.name}
              onChange={(e) =>
                onChange(idx, { ...header, name: e.target.value })
              }
            />
          </Col>
          <Col flex="180px">
            <Select
              value={header.type}
              style={{ width: "100%" }}
              onChange={(value) => onChange(idx, { ...header, type: value })}
              options={dataTypes}
              placeholder="Tipo de dato"
            />
          </Col>
          <Col>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => onRemove(idx)}
            />
          </Col>
        </Row>
      ))}
    </Space>
  );
};

export default HeaderFields;
