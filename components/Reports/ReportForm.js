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

      {/* Commented out unused fields
      <Form.Item name="workspaceId" label="Workspace ID" rules={[]}>
        <Input />
      </Form.Item>

      <Form.Item name="reportId" label="Report ID" rules={[]}>
        <Input />
      </Form.Item>

      <Form.Item name="clientId" label="Client ID" rules={[]}>
        <Input />
      </Form.Item>

      <Form.Item name="clientSecret" label="Client Secret" rules={[]}>
        <Input.Password />
      </Form.Item>

      <Form.Item name="tenantId" label="Tenant ID" rules={[]}>
        <Input />
      </Form.Item>
      */}

      <Form.Item
        name="iframeUrlDesktop"
        label="Iframe URL Desktop"
        rules={[{ type: "url", message: "Debe ser una URL válida" }]}
      >
        <Input placeholder="https://..." />
      </Form.Item>

      <Form.Item
        name="iframeUrlMobile"
        label="Iframe URL Mobile"
        rules={[{ type: "url", message: "Debe ser una URL válida" }]}
      >
        <Input placeholder="https://..." />
      </Form.Item>
    </Form>
  );
}
