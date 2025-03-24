"use client";

import { Typography } from "antd";
import { useAtom } from "jotai";
import { loadingAtom } from "@/utils/atoms";
import RequirementForm from "@/components/RequirementForm";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function CreateRequirementPage() {
  const [loading, setLoading] = useAtom(loadingAtom);
  const router = useRouter();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await fetch("/api/requirements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Error creating requirement");
      }

      router.push("/requirements");
    } catch (error) {
      console.error("Error creating requirement:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="!text-gray-600 mb-4">
          Crear Nuevo Requerimiento
        </Title>

        <RequirementForm
          mode="create"
          initialValues={{
            frequency_by_day: 30,
            days_to_deliver: 5,
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
