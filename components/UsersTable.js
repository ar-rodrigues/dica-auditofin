import { Table, Tag, Button, Space, Avatar, Modal } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function UsersTable({ data, onDelete, userRole }) {
  const router = useRouter();

  const handleDelete = (userId) => {
    Modal.confirm({
      title: "Confirmar eliminación",
      icon: <ExclamationCircleOutlined />,
      content: "¿Estás seguro de querer eliminar este usuario?",
      okText: "Sí",
      cancelText: "No",
      onOk() {
        onDelete(userId);
      },
    });
  };

  const columns = [
    {
      title: "Usuario",
      key: "user",
      render: (_, record) => (
        <Space>
          <Avatar src={record.photo} icon={<UserOutlined />} />
          <div>
            <div className="font-medium">{`${record.first_name} ${record.last_name}`}</div>
            <div className="text-gray-500 text-sm">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const roleColor = role.role_color;
        const roleLabel = role.role?.toUpperCase();
        return <Tag color={roleColor}>{roleLabel}</Tag>;
      },
    },
    {
      title: "Entidad",
      dataIndex: "entity",
      key: "entity",
      render: (entity) => entity?.entity_name || "-",
    },
    {
      title: "Estado",
      dataIndex: "is_active",
      key: "is_active",
      render: (is_active) => (
        <Tag color={is_active ? "green" : "red"}>
          {is_active ? "Activo" : "Inactivo"}
        </Tag>
      ),
    },
    {
      title: "Última Actualización",
      dataIndex: "last_change",
      key: "last_change",
      render: (date) =>
        new Date(date).toLocaleDateString("es-MX", {
          year: "2-digit",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
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
            onClick={() => router.push(`/users/edit/${record.id}`)}
          />
          {userRole === "super admin" && (
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
            />
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      className="bg-white rounded-lg shadow-xs"
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} de ${total} usuarios`,
      }}
    />
  );
}
