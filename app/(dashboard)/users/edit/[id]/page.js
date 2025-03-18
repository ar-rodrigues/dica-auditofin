"use client";

import { useState, useEffect } from "react";
import { Typography } from "antd";
import { useAtom } from "jotai";
import { loadingAtom } from "@/utils/atoms";
import UserForm from "@/components/UserForm";
import { useParams } from "next/navigation";

const { Title } = Typography;

export default function EditUserPage() {
  const [loading, setLoading] = useAtom(loadingAtom);
  const [user, setUser] = useState([]);
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const response = await fetch(`/api/users/${id}`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    };
    fetchUser();
  }, [id, setLoading]);

  console.log("user", user);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="mx-auto max-w-lg flex flex-col items-center justify-center h-[60vh] text-center">
          <div className="bg-white p-8 rounded-lg shadow-md w-full">
            <Title level={3} className="!text-red-600 mb-2">
              Usuario no encontrado
            </Title>
            <p className="text-gray-600 mb-6">
              Lo sentimos, el usuario que estás buscando no existe o ha sido
              eliminado.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-primary hover:bg-primary/80 text-white font-semibold py-2 px-6 rounded-md transition-colors"
            >
              Volver atrás
            </button>
          </div>
        </div>
      </div>
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
          initialValues={{
            first_name: user[0]?.first_name,
            last_name: user[0]?.last_name,
            email: user[0]?.email,
            role: user[0]?.role.role,
            entity: user[0]?.entity.entity_name,
            is_active: user[0]?.is_active,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
