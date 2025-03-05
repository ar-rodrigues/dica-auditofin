"use client";

import { useState } from "react";
import { Input, Select, Space, Typography, Card, Statistic } from "antd";
import {
  SearchOutlined,
  FileOutlined,
  WarningOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { useAtom, useAtomValue } from "jotai";
import { loadingAtom, colorsAtoms, findingsAtom } from "@/utils/atoms";
import FindingsTable from "@/components/FindingsTable";

const { Option } = Select;
const { Title } = Typography;

export default function FindingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [, setLoading] = useAtom(loadingAtom);
  const colors = useAtomValue(colorsAtoms);
  const findingsData = useAtomValue(findingsAtom);

  const areas = [...new Set(findingsData.findings.map((f) => f.area))];
  const riskLevels = [
    ...new Set(findingsData.findings.map((f) => f.riskLevel)),
  ];

  const filteredFindings = findingsData.findings.filter((finding) => {
    const matchesSearch =
      finding.observationCode
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      finding.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === "all" || finding.area === selectedArea;
    const matchesRisk =
      selectedRisk === "all" || finding.riskLevel === selectedRisk;
    return matchesSearch && matchesArea && matchesRisk;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Space direction="vertical" size="small">
          <Title
            level={4}
            className="text-2xl sm:text-3xl font-bold !text-gray-900 mb-2"
          >
            {findingsData.dashboardName}
          </Title>
          <Title level={5} className="!text-gray-600">
            Hallazgos y observaciones
          </Title>
        </Space>

        <Space className="flex flex-wrap gap-4 mb-4">
          <Input
            placeholder="Buscar hallazgo..."
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Select
            className="w-full"
            value={selectedArea}
            onChange={setSelectedArea}
            popupMatchSelectWidth={false}
          >
            <Option value="all">Todas las áreas</Option>
            {areas.map((area) => (
              <Option key={area} value={area}>
                {area}
              </Option>
            ))}
          </Select>

          <Select
            className="w-full"
            value={selectedRisk}
            onChange={setSelectedRisk}
            popupMatchSelectWidth={false}
          >
            <Option value="all">Todos los niveles de riesgo</Option>
            {riskLevels.map((risk) => (
              <Option key={risk} value={risk}>
                {risk}
              </Option>
            ))}
          </Select>
        </Space>

        <Space className="flex flex-wrap gap-4 mb-4 w-full">
          <Card size="small" className="flex-1 min-w-[200px]">
            <Statistic
              title="Total Hallazgos"
              value={findingsData.findings.length}
              prefix={<FileOutlined style={{ color: colors.primary }} />}
            />
          </Card>
          <Card size="small" className="flex-1 min-w-[200px]">
            <Statistic
              title="Alto Riesgo"
              value={
                findingsData.findings.filter((f) => f.riskLevel === "Alto")
                  .length
              }
              prefix={<WarningOutlined style={{ color: colors.secondary }} />}
            />
          </Card>
          <Card size="small" className="flex-1 min-w-[200px]">
            <Statistic
              title="Monto Total Observado"
              value={findingsData.findings.reduce(
                (acc, f) => acc + f.observationAmount,
                0
              )}
              prefix={<BankOutlined style={{ color: colors.black }} />}
              formatter={(value) =>
                `$${value.toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                })}`
              }
            />
          </Card>
        </Space>

        <FindingsTable
          data={filteredFindings}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} hallazgos`,
          }}
        />
      </div>
    </div>
  );
}
