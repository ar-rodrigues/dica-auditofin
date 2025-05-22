"use client";

import React, { useEffect, useState, useMemo } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Spin, Result, Tag, Button, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useUsers } from "@/hooks/useUsers";
import { useEntitiesFormats } from "@/hooks/useEntitiesFormats";
import { useFormatEntries } from "@/hooks/useFormatEntries";
import AuditHeader from "@/components/common/AuditHeader";
import AuditAssignmentTable from "@/components/Audit/AuditAssignmentTable";
import AuditAssignmentDetails from "@/components/Audit/AuditAssignmentDetails";
import AuditStats from "@/components/common/AuditStats";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  SearchOutlined,
  AuditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;

export default function AuditorFormatsPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useFetchUser();
  const { getUserData } = useUsers();
  const {
    fetchEntitiesFormats,
    entitiesFormats,
    loading: formatsLoading,
  } = useEntitiesFormats();
  const {
    fetchFormatEntries,
    createFormatEntry,
    loading: entriesLoading,
  } = useFormatEntries();
  const [auditor, setAuditor] = useState(null);
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [entityFilter, setEntityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!user) return;
        const userData = await getUserData(user.id);

        if (!userData.success || !userData.data?.id) {
          setError("No se pudo obtener la información del auditor.");
          setLoading(false);
          return;
        }

        setAuditor(userData.data);
        // Use the new auditor_user_id parameter instead of auditor
        const formatsData = await fetchEntitiesFormats({
          auditor_user_id: userData.data.id,
        });
        setFormats(formatsData);
      } catch (err) {
        setError("Error al cargar los formatos asignados.");
      } finally {
        setLoading(false);
      }
    };
    if (!userLoading) load();
  }, [user, userLoading]);

  // Handle format navigation
  const handleFormatAction = async (record) => {
    setProcessingId(record.id);
    try {
      // Navigate to the format page for auditor
      router.push(`/auditor/formats/${record.id}`);
    } catch (err) {
      console.error("Error handling format action:", err);
    } finally {
      setProcessingId(null);
    }
  };

  // Filtered formats
  const filteredFormats = useMemo(() => {
    return formats.filter((f) => {
      // Search by format name
      const matchesSearch =
        !search ||
        (f.format?.name || "").toLowerCase().includes(search.toLowerCase());
      // Filter by area
      const matchesArea = areaFilter === "all" || f.area?.id === areaFilter;
      // Filter by entity
      const matchesEntity =
        entityFilter === "all" || f.entity?.id === entityFilter;
      // Filter by status
      const matchesStatus = statusFilter === "all" || f.status === statusFilter;
      return matchesSearch && matchesArea && matchesEntity && matchesStatus;
    });
  }, [formats, search, areaFilter, entityFilter, statusFilter]);

  // Stats by status
  const total = formats.length;
  const asignado = formats.filter((f) => f.status === "asignado").length;
  const pendiente = formats.filter((f) => f.status === "pendiente").length;
  const faltante = formats.filter((f) => f.status === "faltante").length;
  const aprobado = formats.filter((f) => f.status === "aprobado").length;
  const stats = {
    total,
    asignado,
    pendiente,
    faltante,
    aprobado,
  };

  // Area options
  const areaOptions = useMemo(() => {
    const areas = formats
      .map((f) => f.area)
      .filter((a) => a && a.id)
      .reduce((acc, area) => {
        if (!acc.find((a) => a.id === area.id)) acc.push(area);
        return acc;
      }, []);
    return areas;
  }, [formats]);

  // Entity options
  const entityOptions = useMemo(() => {
    const entities = formats
      .map((f) => f.entity)
      .filter((e) => e && e.id)
      .reduce((acc, entity) => {
        if (!acc.find((e) => e.id === entity.id)) acc.push(entity);
        return acc;
      }, []);
    return entities;
  }, [formats]);

  // Update columns to show status with color
  const statusColors = {
    asignado: "blue",
    pendiente: "orange",
    faltante: "red",
    aprobado: "green",
  };

  const statusLabels = {
    asignado: "Asignado",
    pendiente: "Pendiente",
    faltante: "Faltante",
    aprobado: "Aprobado",
  };

  // Button text and icon based on status
  const getButtonProps = (status) => {
    switch (status) {
      case "pendiente":
        return {
          text: "Auditar",
          icon: <AuditOutlined />,
          disabled: false,
          type: "primary",
        };
      case "asignado":
      case "faltante":
      case "aprobado":
        return {
          text: "Ver",
          icon: <EyeOutlined />,
          disabled: false,
          type: "primary",
        };
      default:
        return {
          text: "Ver",
          icon: <EyeOutlined />,
          disabled: false,
          type: "primary",
        };
    }
  };

  // Table columns (read-only, no actions except Acciones)
  const columns = [
    {
      title: "Nombre del Formato",
      dataIndex: ["format", "name"],
      key: "name",
      width: 180,
    },
    {
      title: "Entidad",
      dataIndex: ["entity", "entity_name"],
      key: "entity",
      width: 180,
      render: (entity_name) => entity_name || "-",
    },
    {
      title: "Área",
      dataIndex: ["area", "area"],
      key: "area",
      width: 150,
      render: (area) => area || "-",
    },
    {
      title: "Fecha de entrega",
      dataIndex: "due_date",
      key: "due_date",
      width: 140,
      render: (date) => {
        if (!date) return <Tag color="default">-</Tag>;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(date);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        let color = "green";
        let tooltip = "Más de 1 día restante";
        if (diffDays < 0) {
          color = "red";
          tooltip = "Fecha vencida";
        } else if (diffDays === 0) {
          color = "yellow";
          tooltip = "Último día para entregar";
        } else if (diffDays === 1) {
          color = "orange";
          tooltip = "Queda 1 día para entregar";
        }
        return (
          <Tag color={color} title={tooltip}>
            {due.toLocaleDateString()}
          </Tag>
        );
      },
    },
    {
      title: "Estado",
      key: "status",
      width: 130,
      render: (_, record) => {
        const s = record.status;
        return (
          <Tag color={statusColors[s] || "default"}>
            {statusLabels[s] || "-"}
          </Tag>
        );
      },
    },
    {
      title: "Acciones",
      key: "acciones",
      width: 120,
      render: (_, record) => {
        const buttonProps = getButtonProps(record.status);
        const isProcessing = processingId === record.id;

        return (
          <Button
            type={buttonProps.type}
            icon={isProcessing ? <LoadingOutlined /> : buttonProps.icon}
            disabled={buttonProps.disabled || isProcessing}
            onClick={(e) => {
              e.stopPropagation();
              handleFormatAction(record);
            }}
          >
            {isProcessing ? "Procesando..." : buttonProps.text}
          </Button>
        );
      },
    },
  ];

  // Details fields for drawer
  const detailsFields = [
    { label: "Nombre del Formato", value: (item) => item.format?.name || "" },
    { label: "Entidad", value: (item) => item.entity?.entity_name || "-" },
    { label: "Área", value: (item) => item.area?.area || "-" },
    {
      label: "Fecha de entrega",
      value: (item) =>
        item.due_date ? new Date(item.due_date).toLocaleDateString() : "-",
      render: (item) => {
        if (!item.due_date) return <Tag color="default">-</Tag>;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const due = new Date(item.due_date);
        due.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
        let color = "green";
        let tooltip = "Más de 1 día restante";
        if (diffDays < 0) {
          color = "red";
          tooltip = "Fecha vencida";
        } else if (diffDays === 0) {
          color = "yellow";
          tooltip = "Último día para entregar";
        } else if (diffDays === 1) {
          color = "orange";
          tooltip = "Queda 1 día para entregar";
        }
        return (
          <Tag color={color} title={tooltip}>
            {due.toLocaleDateString()}
          </Tag>
        );
      },
    },
    {
      label: "Estado",
      value: (item) => statusLabels[item.status] || "-",
      render: (item) => (
        <Tag color={statusColors[item.status] || "default"}>
          {statusLabels[item.status] || "-"}
        </Tag>
      ),
    },
  ];

  const DetailsComponent = ({ item }) => (
    <AuditAssignmentDetails
      item={item}
      fields={detailsFields.map((f) => ({
        label: f.label,
        value: typeof f.value === "function" ? f.value(item) : undefined,
        render: f.render ? (i) => f.render(i) : undefined,
      }))}
      status={null} // No status change actions
    />
  );

  if (loading || userLoading || formatsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Result status="error" title="Error" subTitle={error} />
      </div>
    );
  }

  // Custom stats for formats
  const customStats = {
    total: {
      title: "Total",
      icon: <FileTextOutlined />,
      color: "#112eb1",
    },
    asignado: {
      title: "Asignados",
      icon: <FileTextOutlined />,
      color: "#1890ff",
    },
    pendiente: {
      title: "Pendientes",
      icon: <ExclamationCircleOutlined />,
      color: "#faad14",
    },
    faltante: {
      title: "Faltantes",
      icon: <ExclamationCircleOutlined />,
      color: "#f5222d",
    },
    aprobado: {
      title: "Aprobados",
      icon: <CheckCircleOutlined />,
      color: "#52c41a",
    },
  };

  // Filters UI
  const filters = (
    <div className="flex flex-col gap-3 w-full mb-4">
      <Input
        placeholder="Buscar formatos..."
        allowClear
        prefix={<SearchOutlined className="text-gray-400" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />
      <Select
        placeholder="Filtrar Entidades"
        value={entityFilter}
        onChange={setEntityFilter}
        className="w-full"
      >
        <Option value="all">Todas las entidades</Option>
        {entityOptions.map((entity) => (
          <Option key={entity.id} value={entity.id}>
            {entity.entity_name}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Filtrar Áreas"
        value={areaFilter}
        onChange={setAreaFilter}
        className="w-full"
      >
        <Option value="all">Todas las áreas</Option>
        {areaOptions.map((area) => (
          <Option key={area.id} value={area.id}>
            {area.area}
          </Option>
        ))}
      </Select>
      <Select
        placeholder="Filtrar Estado"
        value={statusFilter}
        onChange={setStatusFilter}
        className="w-full"
      >
        <Option value="all">Todos los estados</Option>
        <Option value="asignado">Asignado</Option>
        <Option value="pendiente">Pendiente</Option>
        <Option value="faltante">Faltante</Option>
        <Option value="aprobado">Aprobado</Option>
      </Select>

      <style jsx global>{`
        @media (min-width: 768px) {
          .flex.flex-col.gap-3.w-full {
            flex-direction: row !important;
            align-items: center;
            gap: 1rem !important;
          }
          .flex.flex-col.gap-3.w-full .ant-input-affix-wrapper,
          .flex.flex-col.gap-3.w-full .ant-select {
            width: auto !important;
            min-width: 180px;
          }
        }
      `}</style>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
        <AuditHeader
          title="Formatos para Auditar"
          subtitle="Estos son los formatos asignados para tu revisión."
          userName={`${auditor?.first_name || ""} ${auditor?.last_name || ""}`}
        />
        <AuditAssignmentTable
          data={filteredFormats}
          columns={columns}
          detailsComponent={DetailsComponent}
          detailsTitle="Detalles del formato"
          stats={
            <AuditStats
              stats={{
                total: stats.total,
                asignado: stats.asignado,
                pendiente: stats.pendiente,
                faltante: stats.faltante,
                aprobado: stats.aprobado,
              }}
              customIcons={customStats}
            />
          }
          filters={filters}
        />
      </div>
    </div>
  );
}
