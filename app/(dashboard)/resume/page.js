"use client";

import { useState } from "react";
import { Input, Select, Space, Typography, Card, Statistic } from "antd";
import {
  SearchOutlined,
  FileOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAtom, useAtomValue } from "jotai";
import {
  loadingAtom,
  colorsAtoms,
  requirementsAtom,
  departmentsAtom,
} from "@/utils/atoms";
import RequirementsTable from "@/components/Requirements/RequirementsTable";
import AuditHeader from "@/components/AuditHeader";

const { Option } = Select;
const { Title } = Typography;

export default function ResumePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [filter, setFilter] = useState("all");
  const [, setLoading] = useAtom(loadingAtom);
  const colors = useAtomValue(colorsAtoms);
  const requirements = useAtomValue(requirementsAtom);
  const departments = useAtomValue(departmentsAtom);

  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch = req.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDept =
      selectedDept === "all" || req.dept === departments[selectedDept];
    const matchesFilter =
      filter === "all" ||
      (filter === "delivered" && req.delivered) ||
      (filter === "missing" && !req.delivered);
    return matchesSearch && matchesDept && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <AuditHeader />

        <Title level={5} className="text-gray-600! mb-4">
          Requerimientos de documentación
        </Title>

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

        <Space className="flex flex-wrap gap-4 mb-4 w-full">
          <Card size="small" className="flex-1 min-w-[200px]">
            <Statistic
              title="Total Requerimientos"
              value={requirements.length}
              prefix={<FileOutlined style={{ color: colors.primary }} />}
            />
          </Card>
          <Card size="small" className="flex-1 min-w-[200px]">
            <Statistic
              title="Entregados"
              value={requirements.filter((r) => r.delivered).length}
              prefix={<FileDoneOutlined style={{ color: colors.secondary }} />}
            />
          </Card>
          <Card size="small" className="flex-1 min-w-[200px]">
            <Statistic
              title="Faltantes"
              value={requirements.filter((r) => !r.delivered).length}
              prefix={<ClockCircleOutlined style={{ color: colors.black }} />}
            />
          </Card>
        </Space>

        <div className="overflow-x-auto">
          <RequirementsTable filteredRequirements={filteredRequirements} />
        </div>
      </div>
    </div>
  );
}
