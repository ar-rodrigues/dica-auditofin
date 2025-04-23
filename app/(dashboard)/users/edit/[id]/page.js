"use client";

import { useState, useEffect } from "react";
import { Typography, message } from "antd";
import UserForm from "@/components/Users/UserForm";
import { useParams, useRouter } from "next/navigation";
import NotFoundContent from "@/components/NotFoundContent";
import { useUserRole } from "@/hooks/useUserRole";
import { useRoles } from "@/hooks/useRoles";
import { useEntities } from "@/hooks/useEntities";
import { useUsers } from "@/hooks/useUsers";

const { Title } = Typography;

export default function EditUserPage() {
  const [user, setUser] = useState(null);
  const { getUserById, updateUser, loading } = useUsers();
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const { userRole } = useUserRole();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUserById(id);
      if (userData) {
        setUser(userData[0]);
      }
    };
    fetchUser();
  }, [id, getUserById]);

  const {
    roles,
    loading: rolesLoading,
    error: rolesError,
  } = useRoles(userRole);
  const {
    entities,
    loading: entitiesLoading,
    error: entitiesError,
  } = useEntities();

  const handleSubmit = async (values) => {
    try {
      const result = await updateUser(id, values);
      if (result) {
        message.success("Usuario actualizado correctamente");
        router.push("/users");
      } else {
        message.error("Error al actualizar el usuario");
      }
    } catch (error) {
      message.error("Error al actualizar el usuario");
      console.error(error);
    }
  };

  if (!user) {
    return (
      <NotFoundContent
        title="Usuario no encontrado"
        message="Lo sentimos, el usuario que estás buscando no existe o ha sido eliminado."
        buttonText="Volver atrás"
        buttonAction={() => window.history.back()}
        buttonStyles="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-6 rounded-md transition-colors"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="text-gray-600! mb-4">
          Editar Usuario
        </Title>

        <UserForm
          mode="edit"
          initialValues={user}
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
