import { Form, Input, Select } from "antd";

export default function ReportForm({
  form,
  onFinish,
  onFinishFailed,
  entities = [],
}) {
  return (
    <Form
      form={form}
      layout="vertical"
      className="space-y-4"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        name="name"
        label="Nombre"
        rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="entity_id"
        label="Entidad"
        rules={[
          { required: true, message: "Por favor selecciona una entidad" },
        ]}
      >
        <Select
          placeholder="Selecciona una entidad"
          options={entities.map((entity) => ({
            value: entity.id,
            label: entity.entity_name.toUpperCase(),
          }))}
        />
      </Form.Item>

      <Form.Item
        name="workspaceId"
        label="Workspace ID"
        rules={[
          { required: true, message: "Por favor ingresa el Workspace ID" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="reportId"
        label="Report ID"
        rules={[{ required: true, message: "Por favor ingresa el Report ID" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="clientId"
        label="Client ID"
        rules={[{ required: true, message: "Por favor ingresa el Client ID" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="clientSecret"
        label="Client Secret"
        rules={[
          { required: true, message: "Por favor ingresa el Client Secret" },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="tenantId"
        label="Tenant ID"
        rules={[{ required: true, message: "Por favor ingresa el Tenant ID" }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
}
