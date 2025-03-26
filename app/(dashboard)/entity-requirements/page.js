"use client";

import { useState } from "react";
import {
  Typography,
  Select,
  Card,
  Table,
  Button,
  Space,
  Tag,
  Input,
} from "antd";
import { useRouter } from "next/navigation";
import { EditOutlined, CheckOutlined, StopOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

// Mock data for areas - this would come from your backend later
const mockAreas = [
  { id: 1, name: "Educación" },
  { id: 2, name: "Salud" },
  { id: 3, name: "Finanzas" },
  { id: 4, name: "Obras Públicas" },
  { id: 5, name: "Recursos Humanos" },
];

export default function EntityRequirementsPage() {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const router = useRouter();

  // Mock entities data - replace with your actual entities data
  const entities = [
    { id: 1, name: "Municipio de Puebla" },
    { id: 2, name: "Organismo Operador del Servicio de Limpia" },
  ];

  // Mock assigned requirements data - replace with your actual data
  const mockAssignedRequirements = {
    1: [
      {
        id: 1,
        ref_code: "REQ-001",
        info: "Relación de actas de Sesión de Cabildo",
        area: "Educación",
        areaId: 1,
        status: "active",
      },
      {
        id: 2,
        ref_code: "REQ-002",
        info: "Estados financieros mensuales",
        area: "Educación",
        areaId: 1,
        status: "active",
      },
      {
        id: 3,
        ref_code: "REQ-003",
        info: "Presupuesto anual",
        area: "Finanzas",
        areaId: 3,
        status: "inactive",
      },
    ],
  };

  const handleEdit = () => {
    if (!selectedEntity) return;
    router.push(`/requirements-assignment?entity=${selectedEntity}&edit=true`);
  };

  const handleStatusChange = (record) => {
    // Here you would implement the logic to toggle the status
    console.log("Toggle status for:", record);
  };

  const columns = [
    {
      title: "Código",
      dataIndex: "ref_code",
      key: "ref_code",
      width: 120,
      sorter: (a, b) => a.ref_code.localeCompare(b.ref_code),
    },
    {
      title: "Información",
      dataIndex: "info",
      key: "info",
      width: 300,
      sorter: (a, b) => a.info.localeCompare(b.info),
    },
    {
      title: "Área",
      dataIndex: "area",
      key: "area",
      width: 150,
      sorter: (a, b) => a.area.localeCompare(b.area),
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Activo" : "Inactivo"}
        </Tag>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => handleStatusChange(record)}
          icon={
            record.status === "active" ? <StopOutlined /> : <CheckOutlined />
          }
          className={
            record.status === "active" ? "text-red-500" : "text-green-500"
          }
        >
          {record.status === "active" ? "Desactivar" : "Activar"}
        </Button>
      ),
    },
  ];

  const getFilteredData = () => {
    if (!selectedEntity || !mockAssignedRequirements[selectedEntity]) {
      return [];
    }

    let data = mockAssignedRequirements[selectedEntity];

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      data = data.filter(
        (item) =>
          item.ref_code.toLowerCase().includes(searchLower) ||
          item.info.toLowerCase().includes(searchLower) ||
          item.area.toLowerCase().includes(searchLower)
      );
    }

    if (selectedStatus !== "all") {
      data = data.filter((item) => item.status === selectedStatus);
    }

    if (selectedArea !== "all") {
      data = data.filter((item) => item.areaId === selectedArea);
    }

    return data;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="!text-gray-600 mb-4">
          Requerimientos por Entidad
        </Title>

        <Card className="mb-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleccionar Entidad
              </label>
              <Select
                placeholder="Seleccione una entidad"
                style={{ width: "100%" }}
                onChange={setSelectedEntity}
                value={selectedEntity}
              >
                {entities.map((entity) => (
                  <Option key={entity.id} value={entity.id}>
                    {entity.name}
                  </Option>
                ))}
              </Select>
            </div>
            {selectedEntity && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
                className="mt-6"
              >
                Editar Requerimientos
              </Button>
            )}
          </div>
        </Card>

        {selectedEntity && (
          <Card>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Search
                placeholder="Buscar requerimientos..."
                allowClear
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
              />
              <Select
                placeholder="Filtrar por área"
                style={{ width: 200 }}
                value={selectedArea}
                onChange={setSelectedArea}
              >
                <Option value="all">Todas las áreas</Option>
                {mockAreas.map((area) => (
                  <Option key={area.id} value={area.id}>
                    {area.name}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="Filtrar por estado"
                style={{ width: 200 }}
                value={selectedStatus}
                onChange={setSelectedStatus}
              >
                <Option value="all">Todos</Option>
                <Option value="active">Activos</Option>
                <Option value="inactive">Inactivos</Option>
              </Select>
            </div>
            <Table
              columns={columns}
              dataSource={getFilteredData()}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </Card>
        )}
      </div>
    </div>
  );
}
