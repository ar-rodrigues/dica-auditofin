import { Table, Button, Space, Typography, Avatar } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Paragraph } = Typography;

export default function EntitiesTable({ data, onDelete }) {
  const router = useRouter();

  const columns = [
    {
      title: "Nombre",
      dataIndex: "entity_name",
      key: "entity_name",
      render: (_, record) => (
        <Space>
          <Avatar src={record.entity_logo} icon={<UserOutlined />} size={50} />
          <div>{record.entity_name}</div>
        </Space>
      ),
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2 }} className="mb-0!">
          {text}
        </Paragraph>
      ),
    },
    {
      title: "Fecha de Creación",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) =>
        new Date(date).toLocaleDateString("es-MX", {
          year: "2-digit",
          month: "numeric",
          day: "numeric",
        }),
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
            onClick={() => router.push(`/entities/edit/${record.id}`)}
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
      className="bg-white rounded-lg shadow-xs align-middle"
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 1,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} de ${total} entidades`,
      }}
    />
  );
}
