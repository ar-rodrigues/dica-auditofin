import React from "react";
import { Table, Button, Space, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";

const AuditRequirementsTable = ({
  requirements,
  onRequirementClick,
  filterStatus = "all",
  searchTerm = "",
  buttonColor = "var(--color-primary)",
  buttonTextColor = "var(--color-white)",
  buttonSize = "middle",
}) => {
  const filteredRequirements = requirements.filter((req) => {
    const matchesSearch =
      req.ref_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.info.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Format date string to avoid hydration issues
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return dateString;
    } catch (error) {
      return dateString;
    }
  };

  // Get color for status tag
  const getStatusColor = (status) => {
    switch (status) {
      case "aprobado":
        return "success";
      case "pendiente":
        return "warning";
      case "faltante":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Código de Referencia",
      dataIndex: "ref_code",
      key: "ref_code",
      sorter: (a, b) => a.ref_code.localeCompare(b.ref_code),
    },
    {
      title: "Requerimiento",
      dataIndex: "info",
      key: "info",
      ellipsis: true,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      filters: [
        { text: "Aprobado", value: "aprobado" },
        { text: "Pendiente", value: "pendiente" },
        { text: "Faltante", value: "faltante" },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Fecha de Vencimiento",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (dueDate) => formatDate(dueDate),
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Button
          type="default"
          size={buttonSize}
          icon={<EyeOutlined />}
          style={{
            backgroundColor: buttonColor,
            color: buttonTextColor,
          }}
          onClick={() => onRequirementClick(record.id)}
        >
          Ver Detalles
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredRequirements}
      rowKey="id"
      className="bg-white"
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} requerimientos`,
      }}
      locale={{
        emptyText:
          "No se encontraron requerimientos con los criterios seleccionados",
      }}
    />
  );
};

export default AuditRequirementsTable;
