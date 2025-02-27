"use client";

import { useState, useEffect } from "react";
import { Input, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useAtom, useAtomValue } from "jotai";
import { departmentsAtom, requirementsAtom, loadingAtom } from "@/utils/atoms";
import StatsCards from "@/components/StatsCards";
import RequirementsTable from "@/components/RequirementsTable";

const { Option } = Select;

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
      (filter === "certified" && req.certified) ||
      (filter === "original" && req.original);
    return matchesDept && matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Auditoría Xalapa 2024
          </h1>
          <p className="text-gray-600">Requerimientos de documentación</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
          >
            <Option value="all">Todos los departamentos</Option>
            {Object.keys(departments).map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>

          <Select className="w-full" value={filter} onChange={setFilter}>
            <Option value="all">Todos los documentos</Option>
            <Option value="certified">Copia certificada</Option>
            <Option value="original">Original requerido</Option>
          </Select>
        </div>

        <StatsCards />
        <RequirementsTable filteredRequirements={filteredRequirements} />
      </div>
    </div>
  );
}
