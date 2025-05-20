import React, { useState, useEffect } from "react";
import { Tag, Button, Input, Select, Space, Typography, Paragraph } from "antd";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import StatCard from "../common/StatCard";
import EntityAssignmentTable from "../common/EntityAssignmentTable";
import EntityAssignmentDetails from "../common/EntityAssignmentDetails";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const RequirementsTable = ({
  entity,
  onBack,
  onStatusChange,
  onAddRequirements,
  requirements,
}) => {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    area: "all",
  });
  const [loadingStatus, setLoadingStatus] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Extract unique areas from requirements
  const areas = React.useMemo(() => {
    if (!requirements?.length) return [];
    return [
      ...new Set(requirements.map((req) => req.area?.id).filter(Boolean)),
    ].map((areaId) => {
      const area = requirements.find((req) => req.area?.id === areaId)?.area;
      return { id: areaId, name: area?.area || `Área ${areaId}` };
    });
  }, [requirements]);

  const handleStatusChange = async (requirement) => {
    if (!requirement?.id) return;
    setLoadingStatus((prev) => ({ ...prev, [requirement.id]: true }));
    try {
      await onStatusChange?.(requirement);
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [requirement.id]: false }));
    }
  };

  // Columns for requirements
  const columns = [
    {
      title: "Código",
      dataIndex: ["requirement", "ref_code"],
      key: "ref_code",
      width: 90,
    },
    {
      title: "Información",
      dataIndex: ["requirement", "required_information"],
      key: "required_information",
      width: "30%",
      ellipsis: true,
      render: (text, record) => (
        <Paragraph
          ellipsis={{
            rows: isMobile ? 3 : 2,
            expandable: false,
            tooltip: true,
          }}
          className="mb-0 whitespace-normal cursor-pointer"
        >
          {text}
        </Paragraph>
      ),
    },
    {
      title: "Área",
      dataIndex: ["area", "area"],
      key: "area",
      width: 150,
      render: (area) => area || "-",
    },
    {
      title: "Tiempo",
      dataIndex: ["requirement", "days_to_deliver"],
      key: "days_to_deliver",
      width: 90,
      render: (days) => `${days || 0} días`,
    },
    {
      title: "Fecha de entrega",
      dataIndex: "due_date",
      key: "due_date",
      width: 140,
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Archivo",
      dataIndex: ["requirement", "file_type"],
      key: "file_type",
      width: 100,
      render: (fileTypes) => {
        if (!fileTypes?.length) return "-";
        return (
          <Space size={[0, 4]} wrap>
            {fileTypes.map((type, index) => (
              <Tag key={index} color="blue">
                {type.type}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "is_active",
      key: "is_active",
      width: 90,
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Activo" : "Inactivo"}
        </Tag>
      ),
    },
    {
      title: "Auditor",
      key: "auditor",
      width: 200,
      render: (_, record) => {
        const auditor = record.auditor?.auditor;
        if (auditor && auditor.first_name) {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: 1.2,
              }}
            >
              <span style={{ fontWeight: 500 }}>
                {auditor.first_name} {auditor.last_name}
              </span>
              <span style={{ color: "#888", fontSize: 13 }}>
                {auditor.email}
              </span>
            </div>
          );
        }
        return "-";
      },
    },
    {
      title: "Acciones",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Button
          type="default"
          onClick={(e) => {
            e.stopPropagation();
            handleStatusChange(record);
          }}
          loading={loadingStatus[record.id]}
          className={`px-3 py-1 rounded-md transition-colors min-w-24 max-w-24 ${
            record.is_active
              ? "text-red-600 hover:text-red-800 hover:bg-red-50"
              : "text-green-600 hover:text-green-800 hover:bg-green-50"
          }`}
        >
          {record.is_active ? "Desactivar" : "Activar"}
        </Button>
      ),
    },
  ];

  // Filter requirements based on search and filters
  const filteredRequirements = React.useMemo(() => {
    if (!requirements?.length) return [];
    return requirements.filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.requirement?.required_information
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        item.requirement?.ref_code
          ?.toLowerCase()
          .includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === "all" ||
        item.is_active === (filters.status === "active");
      const matchesArea =
        filters.area === "all" || item.area?.id === filters.area;
      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [requirements, filters]);

  // Stats
  const totalRequirements = requirements?.length || 0;
  const activeRequirements =
    requirements?.filter((req) => req.is_active)?.length || 0;
  const inactiveRequirements = totalRequirements - activeRequirements;
  const stats = (
    <div className={`flex ${isMobile ? "gap-2 mb-4 justify-center" : "gap-4"}`}>
      <StatCard
        title="Total"
        value={totalRequirements}
        icon={<FileTextOutlined />}
        iconColor="#1890ff"
      />
      <StatCard
        title="Activos"
        value={activeRequirements}
        icon={<CheckCircleOutlined />}
        iconColor="#52c41a"
      />
      <StatCard
        title="Inactivos"
        value={inactiveRequirements}
        icon={<StopOutlined />}
        iconColor="#f5222d"
      />
    </div>
  );

  // Filters
  const renderFilters = (
    <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 mb-2">
      <div className="flex-1 flex flex-col md:flex-row md:items-center md:gap-4 gap-2 w-full">
        <Search
          placeholder="Buscar requerimientos..."
          allowClear
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, search: e.target.value }))
          }
          style={isMobile ? { width: "100%" } : { width: 250 }}
          prefix={<SearchOutlined className="text-gray-400" />}
        />
        <Select
          placeholder="Filtrar por área"
          style={isMobile ? { width: "100%" } : { width: 180 }}
          value={filters.area}
          onChange={(value) => setFilters((prev) => ({ ...prev, area: value }))}
        >
          <Option value="all">Filtrar Áreas</Option>
          {areas.map((area) => (
            <Option key={area.id} value={area.id}>
              {area.name}
            </Option>
          ))}
        </Select>
        <Select
          placeholder="Filtrar por estado"
          style={isMobile ? { width: "100%" } : { width: 180 }}
          value={filters.status}
          onChange={(value) =>
            setFilters((prev) => ({ ...prev, status: value }))
          }
        >
          <Option value="all">Filtrar Estados</Option>
          <Option value="active">Activos</Option>
          <Option value="inactive">Inactivos</Option>
        </Select>
      </div>
      {onAddRequirements && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={onAddRequirements}
          className={isMobile ? "w-full" : "w-auto"}
        >
          Editar Asignación
        </Button>
      )}
    </div>
  );

  // Details fields for drawer
  const detailsFields = [
    {
      label: "Código",
      value: (item) => item.requirement?.ref_code || "",
    },
    {
      label: "Información",
      value: (item) => item.requirement?.required_information || "",
    },
    {
      label: "Área",
      value: (item) => item.area?.area || "-",
    },
    {
      label: "Responsable del Área",
      value: (item) => item.area?.responsable || "-",
    },
    {
      label: "Tiempo de entrega",
      value: (item) => `${item.requirement?.days_to_deliver || 0} días`,
    },
    {
      label: "Frecuencia por día",
      value: (item) => `${item.requirement?.frequency_by_day || 0} veces`,
    },
    {
      label: "Tipo de archivo",
      render: (item) =>
        item.requirement?.file_type?.length > 0 ? (
          <Space size={[0, 4]} wrap>
            {item.requirement.file_type.map((type, index) => (
              <Tag key={index} color="blue">
                {type.type}
              </Tag>
            ))}
          </Space>
        ) : (
          "-"
        ),
    },
    {
      label: "Auditor asignado",
      render: (item) =>
        item.auditor &&
        item.auditor.auditor &&
        item.auditor.auditor.first_name ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              lineHeight: 1.2,
            }}
          >
            <span style={{ fontWeight: 500 }}>
              {item.auditor.auditor.first_name} {item.auditor.auditor.last_name}
            </span>
            <span style={{ color: "#888", fontSize: 13 }}>
              {item.auditor.auditor.email}
            </span>
          </div>
        ) : (
          <span>-</span>
        ),
    },
  ];

  // Status config for details
  const detailsStatus = {
    value: (item) => item.is_active,
    activeText: "Desactivar requerimiento",
    inactiveText: "Activar requerimiento",
  };

  // Status icons
  const statusButtonIcons = {
    active: <CheckCircleOutlined />,
    inactive: <StopOutlined />,
  };

  // Details component for drawer
  const DetailsComponent = ({ item }) => (
    <EntityAssignmentDetails
      item={item}
      fields={detailsFields.map((f) => ({
        label: f.label,
        value: typeof f.value === "function" ? f.value(item) : undefined,
        render: f.render ? (i) => f.render(i) : undefined,
      }))}
      status={{
        value: item.is_active,
        activeText: "Desactivar requerimiento",
        inactiveText: "Activar requerimiento",
      }}
      onStatusChange={handleStatusChange}
      loading={loadingStatus[item.id]}
      statusButtonIcons={statusButtonIcons}
    />
  );

  return (
    <EntityAssignmentTable
      entity={entity}
      data={filteredRequirements}
      columns={columns}
      filters={renderFilters}
      stats={stats}
      onBack={onBack}
      onAdd={onAddRequirements}
      detailsComponent={DetailsComponent}
      detailsTitle="Detalles del requerimiento"
      addButtonText="Editar Asignación"
    />
  );
};

export default RequirementsTable;
