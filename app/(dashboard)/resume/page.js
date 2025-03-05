"use client";

import { useState, useEffect } from "react";
import { Input, Select, Space, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useAtom, useAtomValue } from "jotai";
import { departmentsAtom, requirementsAtom, loadingAtom } from "@/utils/atoms";
import StatsCards from "@/components/StatsCards";
import RequirementsTable from "@/components/RequirementsTable";

const { Option } = Select;
const { Title } = Typography;

export default function ResumePage() {
  const departments = useAtomValue(departmentsAtom);
  const requirements = useAtomValue(requirementsAtom);
  const [selectedDept, setSelectedDept] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [, setLoading] = useAtom(loadingAtom);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  const filteredRequirements = requirements.filter((req) => {
    const matchesDept =
      selectedDept === "all" || req.dept === departments[selectedDept];
    const matchesSearch = req.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "delivered" && req.delivered) ||
      (filter === "missing" && !req.delivered);
    return matchesDept && matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className=" mx-auto flex flex-col">
        <Space direction="vertical" size="small">
          <Title
            level={4}
            className="text-2xl sm:text-3xl font-bold !text-gray-900 mb-2"
          >
            Auditoría Puebla 2024
          </Title>
          <Title level={5} className="!text-gray-600">
            Requerimientos de documentación
          </Title>
        </Space>

        <Space className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Buscar requerimiento..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            className="w-full"
            value={selectedDept}
            onChange={setSelectedDept}
            popupMatchSelectWidth={false}
          >
            <Option value="all">Todos los departamentos</Option>
            {Object.keys(departments).map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>

          <Select
            className="w-full"
            value={filter}
            onChange={setFilter}
            popupMatchSelectWidth={false}
          >
            <Option value="all">Todos los documentos</Option>
            <Option value="delivered">Entregados</Option>
            <Option value="missing">Faltantes</Option>
          </Select>
        </Space>
        <StatsCards />

        <div className="overflow-x-auto">
          <RequirementsTable filteredRequirements={filteredRequirements} />
        </div>
      </div>
    </div>
  );
}
