import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Typography,
  Avatar,
  Drawer,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  BankOutlined,
  SearchOutlined,
  PlusOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  StopOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import StatCard from "../common/StatCard";
import RequirementDetails from "./RequirementDetails";

const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

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
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState({});

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
      // Update selectedRequirement if it's the one being changed
      setSelectedRequirement((prev) =>
        prev && prev.id === requirement.id
          ? { ...prev, is_active: !prev.is_active }
          : prev
      );
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [requirement.id]: false }));
    }
  };

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
          onClick={() => {
            setSelectedRequirement(record);
            setIsDrawerVisible(true);
          }}
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
        const auditor =
          record.auditor && record.auditor.auditor_details
            ? record.auditor.auditor_details
            : record.auditor;
        if (auditor && auditor.first_name) {
          return (
            <Space>
              {auditor.photo ? (
                <Avatar size={24} src={auditor.photo} />
              ) : (
                <Avatar size={24}>{auditor.first_name[0]}</Avatar>
              )}
              <span>
                {auditor.first_name} {auditor.last_name}
              </span>
              <span style={{ color: "#888", fontSize: 12 }}>
                ({auditor.email})
              </span>
            </Space>
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

  // Calculate stats for requirements
  const totalRequirements = requirements?.length || 0;
  const activeRequirements =
    requirements?.filter((req) => req.is_active)?.length || 0;
  const inactiveRequirements = totalRequirements - activeRequirements;

  const renderFilters = () => (
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
          Agregar
        </Button>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        {/* Header: Entity info and stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center min-w-0">
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className="mr-4 flex-shrink-0"
              ghost
            >
              Volver
            </Button>
            <Avatar
              size={48}
              icon={<BankOutlined />}
              src={entity?.entity_logo || null}
              className="mr-3 flex-shrink-0 bg-blue-600"
            />
            <div className="min-w-0">
              <Title level={4} className="!m-0 !text-lg truncate">
                {entity?.entity_name || ""}
              </Title>
              <Text type="secondary" className="text-sm truncate">
                {entity?.description || ""}
              </Text>
            </div>
            {!isMobile && (
              <Divider
                type="vertical"
                className="h-12 ml-4"
                style={{ borderLeft: "2px solid #f0f0f0", height: 48 }}
              />
            )}
          </div>
          <div
            className={`flex ${
              isMobile ? "gap-2 mb-4 justify-center" : "gap-4"
            }`}
          >
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
        </div>

        {renderFilters()}
      </div>

      <div className="p-4 sm:p-8">
        <Table
          columns={columns}
          dataSource={filteredRequirements}
          rowKey="id"
          pagination={{
            pageSize: 10,
            hideOnSinglePage: filteredRequirements.length <= 10,
          }}
          className="entity-requirements-table"
          bordered={false}
          scroll={{ x: false }}
          size={isMobile ? "small" : "middle"}
          onRow={(record) => ({
            onClick: () => {
              setSelectedRequirement(record);
              setIsDrawerVisible(true);
            },
            style: { cursor: "pointer" },
          })}
          locale={{
            emptyText: (
              <div className="text-center py-8">
                <InboxOutlined style={{ fontSize: 48, color: "#bfbfbf" }} />
                <Paragraph
                  style={{ fontSize: 16, color: "#bfbfbf" }}
                  className="mt-4"
                >
                  No hay requerimientos disponibles.
                </Paragraph>
                <Button type="primary" onClick={onAddRequirements}>
                  Asigne un nuevo
                </Button>
              </div>
            ),
          }}
        />
      </div>

      <Drawer
        title="Detalles del requerimiento"
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        width={isMobile ? 320 : 450}
      >
        {isDrawerVisible && selectedRequirement && (
          <RequirementDetails
            requirement={selectedRequirement}
            onStatusChange={handleStatusChange}
            loading={loadingStatus[selectedRequirement.id]}
          />
        )}
      </Drawer>
    </div>
  );
};

export default RequirementsTable;
