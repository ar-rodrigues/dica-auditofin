"use client";

import { useState, useEffect } from "react";
import { Typography } from "antd";
import { useAtom } from "jotai";
import { loadingAtom } from "@/utils/atoms";
import UserForm from "@/components/UserForm";
import { useParams } from "next/navigation";
import NotFoundContent from "@/components/NotFoundContent";
import { useUserRole } from "@/hooks/useUserRole";
import { useRoles } from "@/hooks/useRoles";
import { useEntities } from "@/hooks/useEntities";
const { Title } = Typography;

export default function EditUserPage() {
  const [loading, setLoading] = useAtom(loadingAtom);
  const [user, setUser] = useState([]);

  const params = useParams();
  const id = params.id;
  const { userRole } = useUserRole();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      setUser(data[0]);
      setLoading(false);
    };
    fetchUser();
  }, [id, setLoading]);

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
    setLoading(true);
    try {
      // In a real application, you would make an API call here
      const updatedUsers = usersData.map((u) =>
        u.id === userId ? { ...u, ...values } : u
      );

      setUsersData({
        updatedUsers,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.length === 0) {
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
        <Title level={5} className="!text-gray-600 mb-4">
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
        />
      </div>
    </div>
  );
}
