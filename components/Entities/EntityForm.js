import { Form, Input, Button, Space, Row, Col, Card, Switch } from "antd";
const { TextArea } = Input;
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";

export default function EntityForm({
  mode = "create",
  onSubmit,
  form,
  loading,
  initialValues,
}) {
  const router = useRouter();
  const [formValues, setFormValues] = useState(initialValues || null);

  useEffect(() => {
    if (formValues) {
      form.setFieldsValue(formValues);
    }
  }, [formValues, form]);

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          ...formValues,
          is_active: formValues?.is_active ?? true,
          entity_areas: formValues?.entity_areas || [],
        }}
        className="w-full"
      >
        <Row gutter={[24, 0]} align="top">
          <Col xs={24}>
            <Form.Item
              name="entity_name"
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

          <Col xs={24}>
            <Form.Item name="is_active" label="Activo" valuePropName="checked">
              <Switch defaultChecked={formValues?.is_active ?? true} />
            </Form.Item>
          </Col>

          {/* Entity Areas */}
          <Col xs={24}>
            <div className="mb-2">
              <h3 className="text-base font-medium">Áreas de la Entidad</h3>
            </div>
            <Form.List name="entity_areas">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Row key={key} gutter={[16, 0]} align="middle">
                      <Col xs={24} md={10}>
                        <Form.Item
                          {...restField}
                          name={[name, "area"]}
                          rules={[
                            {
                              required: true,
                              message: "Por favor ingrese el nombre del área",
                            },
                          ]}
                        >
                          <Input placeholder="Nombre del área" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={10}>
                        <Form.Item
                          {...restField}
                          name={[name, "responsable"]}
                          rules={[
                            {
                              required: true,
                              message:
                                "Por favor ingrese el nombre del responsable",
                            },
                          ]}
                        >
                          <Input placeholder="Nombre del responsable" />
                        </Form.Item>
                      </Col>
                      <Col xs={24} md={4} className="flex items-center mb-6">
                        <MinusCircleOutlined
                          onClick={() => remove(name)}
                          className="text-red-500 text-xl"
                        />
                      </Col>
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Agregar Área
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Col>

          <Col xs={24} className="mt-6 flex justify-end">
            <Space>
              <Button onClick={() => router.push("/entities")}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {mode === "create" ? "Crear Entidad" : "Actualizar Entidad"}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
