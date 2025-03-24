import { Table, Button, Space, Typography, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Paragraph } = Typography;

export default function RequirementsTable({ data = [], onDelete }) {
  const router = useRouter();

  const columns = [
    {
      title: "Código",
      dataIndex: "ref_code",
      key: "ref_code",
      width: 120,
    },
    {
      title: "Información",
      dataIndex: "info",
      key: "info",
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2 }} className="!mb-0">
          {text}
        </Paragraph>
      ),
    },
    {
      title: "Formato Requerido",
      dataIndex: ["required_format", "format"],
      key: "required_format",
      width: 150,
      render: (text, record) => {
        let color = "blue";
        if (record.required_format.id === "authenticated") color = "green";
        if (record.required_format.id === "original") color = "gold";
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Tipo de Archivo",
      dataIndex: ["file_type", "type"],
      key: "file_type",
      width: 120,
    },
    {
      title: "Frecuencia (días)",
      dataIndex: "frequency_by_day",
      key: "frequency_by_day",
      width: 140,
    },
    {
      title: "Plazo de Entrega",
      dataIndex: "days_to_deliver",
      key: "days_to_deliver",
      width: 140,
      render: (days) => `${days} días`,
    },
    {
      title: "Fecha de Creación",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString("es-MX"),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`/requirements/edit/${record.id}`)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete?.(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      className="bg-white rounded-lg shadow align-middle"
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} de ${total} requerimientos`,
      }}
    />
  );
}
