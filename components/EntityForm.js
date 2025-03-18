import { Form, Input, Button, Space, Row, Col, Card } from "antd";
import { useRouter } from "next/navigation";

const { TextArea } = Input;

export default function EntityForm({
  initialValues,
  onSubmit,
  mode = "create",
}) {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async (values) => {
    await onSubmit(values);
    router.push("/entity");
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
          <Col xs={24}>
            <Form.Item
              name="entityName"
              label="Nombre de la Entidad"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el nombre de la entidad",
                },
              ]}
            >
              <Input placeholder="Ingrese el nombre de la entidad" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="description"
              label="Descripción"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una descripción",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Ingrese una descripción detallada de la entidad"
              />
            </Form.Item>
          </Col>

          <Col xs={24} className="mt-6 flex justify-end">
            <Space>
              <Button onClick={() => router.push("/entity")}>Cancelar</Button>
              <Button type="primary" htmlType="submit">
                {mode === "create" ? "Crear Entidad" : "Actualizar Entidad"}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
