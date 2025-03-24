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
} from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { mockFileTypesAtom, mockRequiredFormatsAtom } from "@/utils/atoms";

const { TextArea } = Input;
const { Option } = Select;

export default function RequirementForm({
  initialValues,
  onSubmit,
  mode = "create",
}) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const fileTypes = useAtomValue(mockFileTypesAtom);
  const requiredFormats = useAtomValue(mockRequiredFormatsAtom);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await onSubmit(values);
      message.success(
        `Requerimiento ${
          mode === "create" ? "creado" : "actualizado"
        } exitosamente`
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      message.error("Error al procesar el formulario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <Form
        form={form}
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
              <Input placeholder="Ej: REQ-001" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              name="required_format"
              label="Formato Requerido"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione el formato requerido",
                },
              ]}
            >
              <Select placeholder="Seleccione el formato">
                {requiredFormats.map((format) => (
                  <Option key={format.id} value={format.id}>
                    {format.format}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="info"
              label="Información"
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

          <Col xs={24} sm={8}>
            <Form.Item
              name="file_type"
              label="Tipo de Archivo"
              rules={[
                {
                  required: true,
                  message: "Por favor seleccione el tipo de archivo",
                },
              ]}
            >
              <Select placeholder="Seleccione el tipo">
                {fileTypes.map((type) => (
                  <Option key={type.id} value={type.id}>
                    {type.type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="frequency_by_day"
              label="Frecuencia (días)"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese la frecuencia",
                },
              ]}
            >
              <InputNumber
                min={1}
                placeholder="Ej: 30"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={8}>
            <Form.Item
              name="days_to_deliver"
              label="Plazo de Entrega (días)"
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
              <Button type="primary" htmlType="submit" loading={loading}>
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
