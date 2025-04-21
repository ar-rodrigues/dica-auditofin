import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  Card,
  InputNumber,
  message,
  Spin,
  Tooltip,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import useDocumentTypes from "@/hooks/useDocumentTypes";
import useFileTypes from "@/hooks/useFileTypes";

const { TextArea } = Input;
const { Option } = Select;

export default function RequirementForm({
  initialValues,
  onSubmit,
  mode = "create",
  loading: externalLoading = false,
  form: externalForm,
}) {
  const [form] = Form.useForm();
  const formInstance = externalForm || form;
  const router = useRouter();
  const [internalLoading, setInternalLoading] = useState(false);
  const { documentTypes, loading: docTypesLoading } = useDocumentTypes();
  const { fileTypes, isLoading: fileTypesLoading } = useFileTypes();

  const isLoading =
    externalLoading || internalLoading || docTypesLoading || fileTypesLoading;

  useEffect(() => {
    if (initialValues) {
      // Transform initialValues to match the form structure
      const transformedValues = {
        ...initialValues,
        // If document_type is an object, extract its id
        document_type:
          initialValues.document_type?.id || initialValues.document_type,
        // Transform file_type array to just the type strings for the form
        file_type: initialValues.file_type?.map((file) => file.id) || [],
      };
      formInstance.setFieldsValue(transformedValues);
    }
  }, [initialValues, formInstance]);

  const handleSubmit = async (values) => {
    try {
      setInternalLoading(true);

      // Transform file_type selection to required format
      const submissionValues = {
        ...values,
        // For document_type, we just need the ID
        document_type: values.document_type,
        // Transform file_type to the array of objects format
        file_type:
          values.file_type
            ?.map((id) => {
              const fileType = fileTypes.find((ft) => ft.id === id);
              return fileType
                ? {
                    id: fileType.id,
                    type: fileType.type,
                    extension: fileType.extension,
                  }
                : null;
            })
            .filter(Boolean) || [],
      };

      await onSubmit(submissionValues);
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Error al procesar el formulario");
    } finally {
      setInternalLoading(false);
    }
  };

  if (docTypesLoading || fileTypesLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card className="w-full mx-auto shadow-sm">
      <Form
        form={formInstance}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
        className="w-full"
      >
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              name="ref_code"
              label="Código de Referencia"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el código de referencia",
                },
              ]}
            >
              <Input placeholder="Ej: 1.4" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="document_type"
              label="Tipo de Documento"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione el tipo de documento",
                },
              ]}
            >
              <Select placeholder="Seleccione el tipo de documento">
                {documentTypes.map((type) => (
                  <Option key={type.id} value={type.id}>
                    {type.name || type.format}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="required_information"
              label="Información Requerida"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese la información del requerimiento",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Ingrese la información detallada del requerimiento"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="file_type"
              label="Tipos de Archivo Permitidos"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione al menos un tipo de archivo",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Seleccione los tipos de archivo permitidos"
                optionFilterProp="children"
                allowClear
              >
                {fileTypes.map((type) => (
                  <Option key={type.id} value={type.id}>
                    {type.type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="frequency_by_day"
              label={
                <Space>
                  Frecuencia (días)
                  <Tooltip
                    placement="top"
                    title="Cada cuántos días se vuelve a solicitar el requerimiento"
                  >
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese la frecuencia",
                },
              ]}
            >
              <InputNumber
                min={1}
                placeholder="Ej: 31"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="days_to_deliver"
              label={
                <Space>
                  Plazo de Entrega (días)
                  <Tooltip
                    placement="top"
                    title="Días disponibles para entregar el requerimiento una vez solicitado"
                  >
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el plazo de entrega",
                },
              ]}
            >
              <InputNumber
                min={1}
                placeholder="Ej: 5"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} className="mt-6 flex justify-end">
            <Space>
              <Button onClick={() => router.push("/requirements")}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit" loading={isLoading}>
                {mode === "create"
                  ? "Crear Requerimiento"
                  : "Actualizar Requerimiento"}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
