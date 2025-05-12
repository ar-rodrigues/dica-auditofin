"use client";

import { useState, useEffect } from "react";
import { Input, Select, Space, Typography, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useAtom, useAtomValue } from "jotai";
import { loadingAtom } from "@/utils/atoms";
import EntitiesTable from "@/components/Entities/EntitiesTable";
import { useRouter } from "next/navigation";
import { useEntities } from "@/hooks/useEntities";

const { Option } = Select;
const { Title } = Typography;

export default function EntitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { entities, loading, deleteEntity } = useEntities();
  const router = useRouter();

  const filteredEntities = entities.filter((entity) => {
    const matchesSearch =
      entity?.entity_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity?.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || entity?.is_active === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (entity) => {
    try {
      const result = await deleteEntity(entity.id);
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      // Error is now handled in the EntitiesTable component
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="text-gray-600! mb-4">
          Gestión de Entidades
        </Title>

        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <Space className="flex flex-wrap gap-4">
            <Input
              placeholder="Buscar entidad..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ minWidth: 150 }}
            >
              <Option value="all">Status</Option>
              <Option value={true}>Activo</Option>
              <Option value={false}>Inactivo</Option>
            </Select>
          </Space>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/entities/create")}
          >
            Nueva Entidad
          </Button>
        </div>

        <EntitiesTable data={filteredEntities} onDelete={handleDelete} />
      </div>
    </div>
  );
}
