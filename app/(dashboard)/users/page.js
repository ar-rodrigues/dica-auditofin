"use client";

import { useState } from "react";
import { Input, Select, Space, Typography, Button, message } from "antd";
import { SearchOutlined, UserAddOutlined } from "@ant-design/icons";
import UsersTable from "@/components/Users/UsersTable";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { useUsers } from "@/hooks/useUsers";

const { Option } = Select;
const { Title } = Typography;

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const router = useRouter();
  const { userRole } = useUserRole();
  const { users, loading, deleteUser } = useUsers();

  const filteredUsers = users?.filter((user) => {
    const matchesSearch =
      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole =
      selectedRole === "all" || user.role?.id === selectedRole;
    const matchesStatus =
      selectedStatus === "all" ||
      user.is_active === (selectedStatus === "active");
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = async (id) => {
    try {
      const result = await deleteUser(id);
      if (result) {
        message.success("Usuario eliminado correctamente");
      } else {
        message.error("Error al eliminar el usuario");
      }
    } catch (error) {
      message.error("Error al eliminar el usuario");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="text-gray-600! mb-4">
          Gestión de Usuarios
        </Title>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <Space className="flex flex-wrap gap-4">
            <Input
              placeholder="Buscar usuario..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              value={selectedRole}
              onChange={setSelectedRole}
              style={{ minWidth: 150 }}
            >
              <Option value="all">Todos los roles</Option>
              <Option value="admin">Administrador</Option>
              <Option value="user">Usuario</Option>
            </Select>

            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ minWidth: 150 }}
            >
              <Option value="all">Todos los estados</Option>
              <Option value="active">Activo</Option>
              <Option value="inactive">Inactivo</Option>
            </Select>
          </Space>

          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => router.push("/users/create")}
          >
            Nuevo Usuario
          </Button>
        </div>

        <UsersTable
          data={filteredUsers}
          loading={loading}
          onDelete={handleDelete}
          userRole={userRole}
        />
      </div>
    </div>
  );
}
