import { Table, Button, Space, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Paragraph } = Typography;

export default function EntitiesTable({ data, onDelete }) {
  const router = useRouter();

  const columns = [
    {
      title: "Nombre",
      dataIndex: "entityName",
      key: "entityName",
      render: (text) => <div className="font-medium">{text}</div>,
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2 }} className="mb-0">
          {text}
        </Paragraph>
      ),
    },
    {
      title: "Fecha de Creación",
      dataIndex: "createdAt",
      key: "createdAt",
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
            onClick={() => router.push(`/entity/edit/${record.id}`)}
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
      className="bg-white rounded-lg shadow"
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} de ${total} entidades`,
      }}
    />
  );
}
