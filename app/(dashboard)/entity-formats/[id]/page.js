"use client";

import React, { useState, useEffect } from "react";
import {
  Spin,
  Result,
  message,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Typography,
  DatePicker,
} from "antd";
import { useRouter, useParams } from "next/navigation";
import { useEntities } from "@/hooks/useEntities";
import { useEntitiesFormats } from "@/hooks/useEntitiesFormats";
import { useUsers } from "@/hooks/useUsers";
import StatCard from "@/components/common/StatCard";
import EntityAssignmentTable from "@/components/common/EntityAssignmentTable";
import EntityAssignmentDetails from "@/components/common/EntityAssignmentDetails";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  StopOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

export default function EntityFormatsDetailPage() {
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    area: "all",
  });
  const [loadingStatus, setLoadingStatus] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const params = useParams();
  const id = params.id;
  const router = useRouter();
  const [entity, setEntity] = useState(null);
  const [formats, setFormats] = useState([]);

  const { getEntityById } = useEntities();
  const { entitiesFormats, updateEntityFormat, fetchEntitiesFormats } =
    useEntitiesFormats();
  const { users, fetchUsers } = useUsers();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [entityData, formatsData] = await Promise.all([
          getEntityById(id),
          fetchEntitiesFormats({ entity: id }),
        ]);
        setEntity(entityData);
        setFormats(formatsData);
        await fetchUsers({ entity: id });
      } catch (err) {
        console.error("Error loading data:", err);
        setEntity(null);
        setFormats([]);
      }
    };
    loadData();
  }, [id]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleStatusChange = async (format) => {
    if (!format?.id) return;
    setLoadingStatus((prev) => ({ ...prev, [format.id]: true }));
    try {
      const result = await updateEntityFormat(format.id, {
        is_active: !format.is_active,
      });
      if (result.success) {
        setFormats((prevFormats) =>
          prevFormats.map((f) =>
            f.id === format.id ? { ...f, is_active: !f.is_active } : f
          )
        );
        message.success(
          format.is_active ? "Formato desactivado" : "Formato activado"
        );
      } else {
        message.error("Error al actualizar el estado del formato");
      }
    } catch (err) {
      console.error("Failed to update format status:", err);
      message.error("Error al actualizar el estado del formato");
    } finally {
      setLoadingStatus((prev) => ({ ...prev, [format.id]: false }));
    }
  };

  const handleGoBack = () => {
    router.push("/entity-formats");
  };

  const handleAddFormats = () => {
    if (entity) {
      router.push(`/entity-formats/${entity.id}/assign`);
    }
  };

  // Extract unique areas from formats
  const areas = React.useMemo(() => {
    if (!formats?.length) return [];
    return [...new Set(formats.map((f) => f.area?.id).filter(Boolean))].map(
      (areaId) => {
        const area = formats.find((f) => f.area?.id === areaId)?.area;
        return { id: areaId, name: area?.area || `Área ${areaId}` };
      }
    );
  }, [formats]);

  // Columns for formats
  const columns = [
    {
      title: "Nombre del Formato",
      dataIndex: ["format", "name"],
      key: "name",
      width: 180,
    },
    {
      title: "Área",
      dataIndex: ["area", "area"],
      key: "area",
      width: 150,
      render: (area) => area || "-",
    },
    {
      title: "Predecesor",
      dataIndex: ["area", "predecessor"],
      key: "predecessor",
      width: 180,
      render: (_, record) => {
        const predecessor = record.area?.predecessor;
        if (predecessor) {
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
                {predecessor.first_name} {predecessor.last_name}
              </span>
              <span style={{ color: "#888", fontSize: 13 }}>
                {predecessor.email}
              </span>
            </div>
          );
        }
        return "-";
      },
    },
    {
      title: "Sucesor",
      key: "successor",
      width: 180,
      render: (_, record) => {
        const successor = record.area?.successor;
        if (successor) {
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
                {successor.first_name} {successor.last_name}
              </span>
              <span style={{ color: "#888", fontSize: 13 }}>
                {successor.email}
              </span>
            </div>
          );
        }
        return "-";
      },
    },
    {
      title: "Fecha de entrega",
      dataIndex: "due_date",
      key: "due_date",
      width: 140,
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
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

  // Filter formats based on search and filters
  const filteredFormats = React.useMemo(() => {
    if (!formats?.length) return [];
    return formats.filter((item) => {
      const matchesSearch =
        !filters.search ||
        item.format?.name?.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus =
        filters.status === "all" ||
        item.is_active === (filters.status === "active");
      const matchesArea =
        filters.area === "all" || item.area?.id === filters.area;
      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [formats, filters]);

  // Stats
  const totalFormats = formats?.length || 0;
  const activeFormats = formats?.filter((f) => f.is_active)?.length || 0;
  const inactiveFormats = totalFormats - activeFormats;
  const stats = (
    <div
      className={`flex ${
        isMobile ? "gap-2 mb-4 justify-center" : "gap-4"
      } w-full`}
    >
      <div className={`flex-1 ${isMobile ? "max-w-[32%]" : "max-w-[33%]"}`}>
        <StatCard
          title="Total"
          value={totalFormats}
          icon={<FileTextOutlined />}
          iconColor="#1890ff"
        />
      </div>
      <div className={`flex-1 ${isMobile ? "max-w-[32%]" : "max-w-[33%]"}`}>
        <StatCard
          title="Activos"
          value={activeFormats}
          icon={<CheckCircleOutlined />}
          iconColor="#52c41a"
        />
      </div>
      <div className={`flex-1 ${isMobile ? "max-w-[32%]" : "max-w-[33%]"}`}>
        <StatCard
          title="Inactivos"
          value={inactiveFormats}
          icon={<StopOutlined />}
          iconColor="#f5222d"
        />
      </div>
    </div>
  );

  // Filters
  const renderFilters = (
    <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 mb-2">
      <div className="flex-1 flex flex-col md:flex-row md:items-center md:gap-4 gap-2 w-full">
        <Search
          placeholder="Buscar formatos..."
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
      {entity && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddFormats}
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
      label: "Nombre del Formato",
      value: (item) => item.format?.name || "",
    },
    {
      label: "Área",
      value: (item) => item.area?.area || "-",
    },
    {
      label: "Predecesor",
      value: (item) =>
        item.area?.predecessor
          ? `${item.area.predecessor.first_name} ${item.area.predecessor.last_name}`
          : "-",
    },
    {
      label: "Sucesor",
      value: (item) =>
        item.area?.successor
          ? `${item.area.successor.first_name} ${item.area.successor.last_name}`
          : "-",
    },
    {
      label: "Fecha de entrega",
      value: (item) =>
        item.due_date ? new Date(item.due_date).toLocaleDateString() : "-",
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

  // Status icons
  const statusButtonIcons = {
    active: <CheckCircleOutlined />,
    inactive: <StopOutlined />,
  };

  // Details component for drawer
  const DetailsComponent = ({ item, closeDrawer }) => (
    <EntityAssignmentDetails
      item={item}
      fields={detailsFields.map((f) => ({
        label: f.label,
        value: typeof f.value === "function" ? f.value(item) : undefined,
        render: f.render ? (i) => f.render(i) : undefined,
      }))}
      status={{
        value: item.is_active,
        activeText: "Activo",
        inactiveText: "Inactivo",
      }}
      onStatusChange={async (item) => {
        await handleStatusChange(item);
        if (closeDrawer) closeDrawer();
      }}
      loading={loadingStatus[item.id]}
      statusButtonIcons={statusButtonIcons}
    />
  );

  if (!entity) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-center">
              <Spin size="large" />
              <div className="mt-3 text-gray-600">Cargando formatos...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
        <EntityAssignmentTable
          entity={entity}
          data={filteredFormats}
          columns={columns}
          filters={renderFilters}
          stats={stats}
          onBack={handleGoBack}
          onAdd={handleAddFormats}
          detailsComponent={DetailsComponent}
          detailsTitle="Detalles del formato"
          addButtonText="Editar Asignación"
        />
      </div>
    </div>
  );
}
