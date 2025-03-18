"use client";

import { useState } from "react";
import { Input, Select, Space, Typography, Button } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useAtom, useAtomValue } from "jotai";
import { loadingAtom, entitiesAtom } from "@/utils/atoms";
import EntitiesTable from "@/components/EntitiesTable";
import AuditHeader from "@/components/AuditHeader";
import { useRouter } from "next/navigation";

const { Option } = Select;
const { Title } = Typography;

export default function EntitiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [, setLoading] = useAtom(loadingAtom);
  const entitiesData = useAtomValue(entitiesAtom);
  const router = useRouter();

  const filteredEntities = entitiesData.entities.filter((entity) => {
    const matchesSearch =
      entity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entity.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || entity.type === selectedType;
    const matchesStatus =
      selectedStatus === "all" || entity.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDelete = (entity) => {
    // Implement delete functionality
    console.log("Delete entity:", entity);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="!text-gray-600 mb-4">
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
              value={selectedType}
              onChange={setSelectedType}
              style={{ minWidth: 150 }}
            >
              <Option value="all">Todos los tipos</Option>
              <Option value="Municipal">Municipal</Option>
              <Option value="Estatal">Estatal</Option>
              <Option value="Federal">Federal</Option>
            </Select>

            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              style={{ minWidth: 150 }}
            >
              <Option value="all">Todos los estados</Option>
              <Option value="active">Activo</Option>
              <Option value="inactive">Inactivo</Option>
            </Select>
          </Space>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push("/entity/create")}
          >
            Nueva Entidad
          </Button>
        </div>

        <EntitiesTable data={filteredEntities} onDelete={handleDelete} />
      </div>
    </div>
  );
}
