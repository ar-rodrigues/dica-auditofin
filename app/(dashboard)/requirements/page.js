"use client";

import { useState } from "react";
import { Input, Select, Space, Typography, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useAtomValue } from "jotai";
import { mockRequirementsAtom } from "@/utils/atoms";
import RequirementsTable from "@/components/RequirementsTable";
import { useRouter } from "next/navigation";

const { Option } = Select;
const { Title } = Typography;

export default function RequirementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("all");
  const requirements = useAtomValue(mockRequirementsAtom);
  const router = useRouter();

  const filteredRequirements = requirements.filter((requirement) => {
    const matchesSearch =
      requirement?.ref_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requirement?.info?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFormat =
      selectedFormat === "all" ||
      requirement?.required_format?.id === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  const handleDelete = (requirement) => {
    // Implement delete functionality
    console.log("Delete requirement:", requirement);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="!text-gray-600 mb-4">
          Gestión de Requerimientos
        </Title>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <Space className="flex flex-wrap gap-4">
            <Input
              placeholder="Buscar requerimiento..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              value={selectedFormat}
              onChange={setSelectedFormat}
              style={{ minWidth: 150 }}
            >
              <Option value="all">Formato</Option>
              <Option value="simple">Copia Simple</Option>
              <Option value="authenticated">Copia Autenticada</Option>
              <Option value="original">Original</Option>
            </Select>
          </Space>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/requirements/create")}
          >
            Nuevo Requerimiento
          </Button>
        </div>

        <RequirementsTable
          data={filteredRequirements}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
