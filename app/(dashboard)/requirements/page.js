"use client";

import { useState } from "react";
import { Input, Select, Space, Typography, Button, Spin, message } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import RequirementsTable from "@/components/Requirements/RequirementsTable";
import { useRouter } from "next/navigation";
import useRequirements from "@/hooks/useRequirements";
import useDocumentTypes from "@/hooks/useDocumentTypes";

const { Option } = Select;
const { Title } = Typography;

export default function RequirementsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("all");
  const router = useRouter();

  const {
    requirements,
    isLoading,
    error,
    fetchRequirements,
    deleteRequirement,
  } = useRequirements();
  const { documentTypes, loading: docTypesLoading } = useDocumentTypes();

  const filteredRequirements = requirements.filter((requirement) => {
    const matchesSearch =
      requirement?.ref_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      requirement?.required_information
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesDocType =
      selectedDocType === "all" ||
      requirement?.document_type?.id === selectedDocType;

    return matchesSearch && matchesDocType;
  });

  const handleDelete = async (requirement) => {
    try {
      const result = await deleteRequirement(requirement.id);
      if (result.success) {
        message.success("Requerimiento eliminado exitosamente");
      } else {
        message.error("Error al eliminar el requerimiento");
      }
    } catch (err) {
      message.error(`Error: ${err.message}`);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error al cargar los requerimientos: {error}</p>
          <Button type="primary" onClick={fetchRequirements} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 mb-10">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="text-gray-600! mb-4">
          Gestión de Requerimientos
        </Title>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <Space className="flex flex-wrap gap-4">
            <Input
              placeholder="Buscar requerimiento..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "240px" }}
            />

            <Select
              value={selectedDocType}
              onChange={setSelectedDocType}
              style={{ minWidth: 150 }}
              loading={docTypesLoading}
              placeholder="Tipo de documento"
            >
              <Option value="all">Tipo de Documento</Option>
              {documentTypes.map((docType) => (
                <Option key={docType.id} value={docType.id}>
                  {docType.name || docType.format}
                </Option>
              ))}
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

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <RequirementsTable
            data={filteredRequirements}
            documentTypes={documentTypes}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
