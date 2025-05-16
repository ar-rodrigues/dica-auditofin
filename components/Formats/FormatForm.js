import React, { useState } from "react";
import { Button, Form, Input, Typography, message, Space, Card } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import ImportHeadersModal from "./ImportHeadersModal";
import HeaderFields from "./HeaderFields";

const { Title } = Typography;

const FormatForm = ({
  initialValues = {},
  headers,
  setHeaders,
  nombreFormato,
  setNombreFormato,
  description,
  setDescription,
  onSubmit,
  loading,
  title = "Formato",
}) => {
  const [form] = Form.useForm();
  const [importModalOpen, setImportModalOpen] = useState(false);

  const handleImportHeaders = (importedHeaders) => {
    setHeaders(importedHeaders);
    setImportModalOpen(false);
  };

  const handleAddHeader = () => {
    setHeaders([...headers, { name: "", type: "string" }]);
  };

  const handleHeaderChange = (index, field) => {
    const newHeaders = [...headers];
    newHeaders[index] = field;
    setHeaders(newHeaders);
  };

  const handleRemoveHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleFinish = () => {
    if (headers.length === 0) {
      message.error("Agrega al menos un encabezado");
      return;
    }
    onSubmit({ headers });
  };

  return (
    <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Title level={2}>{title}</Title>
      <Card>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item label="Nombre del formato" required>
            <Input
              placeholder="Ejemplo: Formato de Inventario"
              value={nombreFormato}
              onChange={(e) => setNombreFormato(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Descripción">
            <Input.TextArea
              placeholder="Descripción del formato (opcional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>
          <Form.Item label="Encabezados">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                icon={<UploadOutlined />}
                onClick={() => setImportModalOpen(true)}
              >
                Importar desde Excel/CSV o copiar y pegar
              </Button>

              <HeaderFields
                headers={headers}
                onChange={handleHeaderChange}
                onRemove={handleRemoveHeader}
              />
              <Button
                icon={<PlusOutlined />}
                onClick={handleAddHeader}
                type="dashed"
                block
              >
                Agregar encabezado
              </Button>
            </Space>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Guardar formato
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <ImportHeadersModal
        open={importModalOpen}
        onOk={handleImportHeaders}
        onCancel={() => setImportModalOpen(false)}
      />
    </div>
  );
};

export default FormatForm;
