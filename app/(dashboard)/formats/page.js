"use client";
import React, { useEffect } from "react";
import { Button, Space, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useFormats } from "@/hooks/useFormats";
import FormatsTable from "@/components/Formats/FormatsTable";

const { Title } = Typography;

const FormatsPage = () => {
  const router = useRouter();
  const { formats, loading, error, fetchFormats } = useFormats();

  useEffect(() => {
    fetchFormats();
  }, []);

  const handleEdit = (record) => {
    router.push(`/formats/edit/${record.id}`);
  };

  return (
    <div style={{ padding: 24 }}>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Formatos
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push("/formats/create")}
        >
          Nuevo formato
        </Button>
      </Space>
      <FormatsTable
        formats={formats}
        loading={loading}
        error={error}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default FormatsPage;
