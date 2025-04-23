"use client";

import { Typography, message } from "antd";
import UserForm from "@/components/Users/UserForm";
import { useRoles } from "@/hooks/useRoles";
import { useEntities } from "@/hooks/useEntities";
import { useUsers } from "@/hooks/useUsers";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function CreateUserPage() {
  const { createUser, loading } = useUsers();
  const router = useRouter();
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();
  const {
    entities,
    loading: entitiesLoading,
    error: entitiesError,
  } = useEntities();

  const handleSubmit = async (values) => {
    try {
      const result = await createUser(values);
      if (result) {
        message.success("Usuario creado correctamente");
        router.push("/users");
      } else {
        message.error("Error al crear el usuario");
      }
    } catch (error) {
      message.error("Error al crear el usuario");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="text-gray-600! mb-4">
          Crear Nuevo Usuario
        </Title>

        <UserForm
          mode="create"
          initialValues={{
            is_active: true,
            role: "user",
          }}
          onSubmit={handleSubmit}
          roles={roles}
          entities={entities}
          rolesLoading={rolesLoading}
          entitiesLoading={entitiesLoading}
          rolesError={rolesError}
          entitiesError={entitiesError}
          loading={loading}
        />
      </div>
    </div>
  );
}
