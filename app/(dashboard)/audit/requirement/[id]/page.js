"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Typography, Space, Card, Skeleton } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import AuditHeader from "@/components/AuditHeader";
import RequirementDetails from "@/components/common/RequirementDetails";
import { useAtom } from "jotai";
import { mockRequirementsAtom } from "@/utils/atoms";

const { Title } = Typography;

export default function RequirementDetailPage({ params }) {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requirements] = useAtom(mockRequirementsAtom);
  const requirement = requirements.find((req) => req.id === parseInt(id));

  console.log("requirement on page", requirement);

  useEffect(() => {
    try {
      const fetchParams = async () => {
        setIsLoading(true);
        const resolvedParams = await params;
        setId(resolvedParams.id);
      };
      fetchParams();
    } catch (error) {
      console.error("Error fetching params:", error);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  const handleUpload = (file) => {
    // Mock upload functionality
    console.log("Uploading file:", file);
    // In a real app, you would handle the file upload to your backend
  };

  if (!requirement && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="mx-auto flex flex-col">
          <Card className="text-center p-8">
            <Title level={3}>Requerimiento no encontrado</Title>
            <p className="text-gray-600 mb-6">
              El requerimiento que buscas no existe o ha sido eliminado.
            </p>
            <Button type="primary" onClick={() => router.push("/audit")}>
              Volver a requerimientos
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <AuditHeader
          title="Detalles del Requerimiento"
          subtitle="Ver y gestionar este requerimiento"
        />

        <div className="mt-8">
          <Card className="shadow-md rounded-lg">
            <Space className="mb-6">
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push("/audit")}
              >
                Volver a requerimientos
              </Button>
            </Space>

            <RequirementDetails
              requirementId={id}
              requirement={requirement}
              isAuditor={false}
              onUpload={handleUpload}
              buttonText="Enviar"
              maxFileSize={15}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
