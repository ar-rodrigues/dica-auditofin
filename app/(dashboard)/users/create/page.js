"use client";

import { Typography } from "antd";
import { useAtom } from "jotai";
import { loadingAtom, usersAtom } from "@/utils/atoms";
import UserForm from "@/components/UserForm";

const { Title } = Typography;

export default function CreateUserPage() {
  const [, setLoading] = useAtom(loadingAtom);
  const [usersData, setUsersData] = useAtom(usersAtom);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // In a real application, you would make an API call here
      const newUser = {
        ...values,
        id: usersData.users.length + 1,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setUsersData({
        users: [...usersData.users, newUser],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="!text-gray-600 mb-4">
          Crear Nuevo Usuario
        </Title>

        <UserForm
          mode="create"
          initialValues={{
            status: "active",
            role: "user",
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
