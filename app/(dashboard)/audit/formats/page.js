"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Spin, Result, Tag, Button, Input, Select } from "antd";
import { useRouter } from "next/navigation";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useUsers } from "@/hooks/useUsers";
import { useEntitiesFormats } from "@/hooks/useEntitiesFormats";
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
} from "@ant-design/icons";

const { Option } = Select;

export default function AuditFormatsPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useFetchUser();
  const { getUserData } = useUsers();
  const {
    fetchEntitiesFormats,
    entitiesFormats,
    loading: formatsLoading,
  } = useEntitiesFormats();
  const [entity, setEntity] = useState(null);
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!user) return;
        const userData = await getUserData(user.id);
        console.log(userData);
        if (!userData.success || !userData.data?.entity?.id) {
          setError("No se pudo obtener la entidad del usuario.");
          setLoading(false);
          return;
        }
        setEntity(userData.data.entity);
        const formatsData = await fetchEntitiesFormats({
          entity: userData.data.entity.id,
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

  console.log(entity);

  // Filtered formats
  const filteredFormats = useMemo(() => {
    return formats.filter((f) => {
      // Search by format name
      const matchesSearch =
        !search ||
        (f.format?.name || "").toLowerCase().includes(search.toLowerCase());
      // Filter by area
      const matchesArea = areaFilter === "all" || f.area?.id === areaFilter;
      // Filter by status
      const matchesStatus = statusFilter === "all" || f.status === statusFilter;
      return matchesSearch && matchesArea && matchesStatus;
    });
  }, [formats, search, areaFilter, statusFilter]);

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

  // Table columns (read-only, no actions except Acciones)
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
      key: "acciones",
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/audit/formats/${record.id}`);
          }}
        >
          Ver
        </Button>
      ),
    },
  ];

  // Details fields for drawer
  const detailsFields = [
    { label: "Nombre del Formato", value: (item) => item.format?.name || "" },
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
      color: "#112eb1", // Changed to purple to differentiate from asignado
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
          title="Formatos Asignados"
          subtitle="Estos son los formatos asignados a tu entidad."
          entityName={entity?.entity_name || ""}
        />
        <AuditAssignmentTable
          entity={entity}
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
