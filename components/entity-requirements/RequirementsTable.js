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
  Card,
  Drawer,
  List,
  Divider,
  Badge,
  Tooltip,
} from "antd";
import {
  CheckOutlined,
  StopOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  SearchOutlined,
  PlusOutlined,
  MenuOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const RequirementsTable = ({
  entity,
  onBack,
  onStatusChange,
  onAddRequirements,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedArea, setSelectedArea] = useState("all");
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Add enter animation for the table
  useEffect(() => {
    const tableElement = document.querySelector(".entity-requirements-table");
    if (tableElement) {
      tableElement.style.opacity = 0;
      tableElement.style.transform = "translateY(20px)";

      // Trigger animation after a small delay
      setTimeout(() => {
        tableElement.style.transition =
          "opacity 0.3s ease, transform 0.3s ease";
        tableElement.style.opacity = 1;
        tableElement.style.transform = "translateY(0)";
      }, 100);
    }
  }, []);

  // Extract all unique areas from the entity's requirements
  const areas = React.useMemo(() => {
    if (!entity || !entity.requirements || !entity.requirements.length) {
      return [];
    }

    const uniqueAreas = new Set();
    entity.requirements.forEach((req) => {
      if (req.area) {
        uniqueAreas.add(req.area);
      }
    });

    return Array.from(uniqueAreas).map((areaId) => {
      return {
        id: areaId,
        name: `Área ${areaId}`,
      };
    });
  }, [entity]);

  const showDrawer = (record) => {
    setSelectedRequirement(record);
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
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
        <div onClick={() => showDrawer(record)}>
          <Paragraph
            ellipsis={{
              rows: isMobile ? 3 : 2,
              expandable: false,
              tooltip: true,
            }}
            className="mb-0 whitespace-normal"
            style={{ cursor: "pointer" }}
          >
            {text}
          </Paragraph>
        </div>
      ),
    },
    {
      title: "Área",
      dataIndex: "area",
      key: "area",
      width: 110,
      render: (area) => `Área ${area || "-"}`,
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
        if (!fileTypes || !fileTypes.length) return "-";
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
      title: "Acciones",
      key: "actions",
      width: 110,
      render: (_, record) => (
        <Button
          type="text"
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange && onStatusChange(record);
          }}
          className={`px-3 py-1 rounded-md transition-colors ${
            record.is_active
              ? "text-red-600 hover:text-red-800 hover:bg-red-50"
              : "text-green-600 hover:text-green-800 hover:bg-green-50"
          }`}
          icon={record.is_active ? <StopOutlined /> : <CheckOutlined />}
        >
          {record.is_active ? "Desactivar" : "Activar"}
        </Button>
      ),
    },
  ];

  // Filter requirements based on search and filters
  const filteredRequirements = React.useMemo(() => {
    if (!entity || !entity.requirements) return [];

    let data = [...entity.requirements];

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      data = data.filter((item) => {
        const reqInfo = item.requirement?.required_information || "";
        const reqCode = item.requirement?.ref_code || "";

        return (
          reqInfo.toLowerCase().includes(searchLower) ||
          reqCode.toLowerCase().includes(searchLower)
        );
      });
    }

    if (selectedStatus !== "all") {
      const isActive = selectedStatus === "active";
      data = data.filter((item) => item.is_active === isActive);
    }

    if (selectedArea !== "all" && selectedArea) {
      data = data.filter((item) => item.area === selectedArea);
    }

    return data;
  }, [entity, searchText, selectedStatus, selectedArea]);

  const renderMobileFilters = () => {
    return (
      <div
        className={`bg-white border-t border-b border-gray-200 py-3 px-4 ${
          showMobileFilters ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col space-y-3">
          <Select
            placeholder="Filtrar por área"
            style={{ width: "100%" }}
            value={selectedArea}
            onChange={setSelectedArea}
          >
            <Option value="all">Todas las áreas</Option>
            {areas.map((area) => (
              <Option key={area.id} value={area.id}>
                {area.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Filtrar por estado"
            style={{ width: "100%" }}
            value={selectedStatus}
            onChange={setSelectedStatus}
          >
            <Option value="all">Todos</Option>
            <Option value="active">Activos</Option>
            <Option value="inactive">Inactivos</Option>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
          <div className="flex items-center">
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className="mr-4 flex-shrink-0"
              ghost
            >
              Volver
            </Button>

            <div className="flex items-center">
              <Avatar
                size={48}
                icon={<BankOutlined />}
                src={entity?.entity_logo}
                className="mr-3 flex-shrink-0 bg-blue-600"
              />
              <div>
                <Title level={4} className="!m-0 !text-lg">
                  {entity?.entity_name || ""}
                </Title>
                <Text type="secondary" className="text-sm">
                  {entity?.description || ""}
                </Text>
              </div>
            </div>
          </div>

          {onAddRequirements && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddRequirements}
            >
              Agregar
            </Button>
          )}
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-lg">
          <Search
            placeholder="Buscar requerimientos..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            prefix={<SearchOutlined className="text-gray-400" />}
          />

          <Select
            placeholder="Filtrar por área"
            style={{ width: 180 }}
            value={selectedArea}
            onChange={setSelectedArea}
          >
            <Option value="all">Todas las áreas</Option>
            {areas.map((area) => (
              <Option key={area.id} value={area.id}>
                {area.name}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Filtrar por estado"
            style={{ width: 180 }}
            value={selectedStatus}
            onChange={setSelectedStatus}
          >
            <Option value="all">Todos</Option>
            <Option value="active">Activos</Option>
            <Option value="inactive">Inactivos</Option>
          </Select>
        </div>

        {/* Mobile Search and Filter Buttons */}
        <div className="flex md:hidden items-center gap-2 mt-4">
          <Search
            placeholder="Buscar..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            className="flex-1"
          />
          <Button
            icon={<FilterOutlined />}
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={
              showMobileFilters
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : ""
            }
          />
        </div>

        {/* Mobile Filters */}
        {isMobile && renderMobileFilters()}
      </div>

      {/* Table for all devices - mobile optimized with details drawer */}
      <div>
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
            onClick: () => showDrawer(record),
            style: { cursor: "pointer" },
          })}
        />
      </div>

      {/* Detail Drawer for both mobile and desktop */}
      <Drawer
        title="Detalles del requerimiento"
        placement="right"
        onClose={closeDrawer}
        open={isDrawerVisible}
        width={isMobile ? 320 : 450}
      >
        {isDrawerVisible && selectedRequirement && (
          <div className="space-y-4">
            <div>
              <Text type="secondary" className="text-xs">
                Código
              </Text>
              <Paragraph strong className="text-lg mt-1">
                {selectedRequirement.requirement?.ref_code || ""}
              </Paragraph>
            </div>

            <Divider className="my-3" />

            <div>
              <Text type="secondary" className="text-xs">
                Información
              </Text>
              <Paragraph className="mt-1">
                {selectedRequirement.requirement?.required_information || ""}
              </Paragraph>
            </div>

            <div>
              <Text type="secondary" className="text-xs">
                Área
              </Text>
              <Paragraph className="mt-1">
                Área {selectedRequirement.area || "-"}
              </Paragraph>
            </div>

            <div>
              <Text type="secondary" className="text-xs">
                Tiempo de entrega
              </Text>
              <Paragraph className="mt-1">
                {selectedRequirement.requirement?.days_to_deliver || 0} días
              </Paragraph>
            </div>

            <div>
              <Text type="secondary" className="text-xs">
                Tipo de archivo
              </Text>
              <div className="mt-1">
                {selectedRequirement.requirement?.file_type &&
                selectedRequirement.requirement.file_type.length > 0 ? (
                  <Space size={[0, 4]} wrap>
                    {selectedRequirement.requirement.file_type.map(
                      (type, index) => (
                        <Tag key={index} color="blue">
                          {type.type}
                        </Tag>
                      )
                    )}
                  </Space>
                ) : (
                  "-"
                )}
              </div>
            </div>

            <div>
              <Text type="secondary" className="text-xs">
                Estado
              </Text>
              <div className="mt-1">
                <Tag color={selectedRequirement.is_active ? "green" : "red"}>
                  {selectedRequirement.is_active ? "Activo" : "Inactivo"}
                </Tag>
              </div>
            </div>

            <Divider className="my-3" />

            <Button
              type={selectedRequirement.is_active ? "default" : "primary"}
              danger={selectedRequirement.is_active}
              icon={
                selectedRequirement.is_active ? (
                  <StopOutlined />
                ) : (
                  <CheckOutlined />
                )
              }
              block
              onClick={() => {
                onStatusChange && onStatusChange(selectedRequirement);
                closeDrawer();
              }}
              className={`h-10 ${
                selectedRequirement.is_active
                  ? "border-red-500 text-red-600 hover:bg-red-50"
                  : "bg-green-600 hover:bg-green-700 border-green-600"
              }`}
            >
              {selectedRequirement.is_active
                ? "Desactivar requerimiento"
                : "Activar requerimiento"}
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default RequirementsTable;
