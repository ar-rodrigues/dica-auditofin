"use client";

import { useState, useEffect } from "react";
import { Table, Button, message, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Link from "next/link";
import ReportActions from "@/components/Reports/ReportActions";
import { useReports } from "@/hooks/useReports";

export default function ReportsPage() {
  const { reports, loading, error, fetchReports, deleteReport } = useReports();

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Entidad",
      dataIndex: "entity_name",
      key: "entity_name",
    },
    {
      title: "Iframe URL Desktop",
      dataIndex: "iframeUrlDesktop",
      key: "iframeUrlDesktop",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            {text.length > 30 ? `${text.slice(0, 30)}...` : text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "Iframe URL Mobile",
      dataIndex: "iframeUrlMobile",
      key: "iframeUrlMobile",
      render: (text) =>
        text ? (
          <Tooltip title={text}>
            {text.length > 30 ? `${text.slice(0, 30)}...` : text}
          </Tooltip>
        ) : (
          ""
        ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <ReportActions record={record} onDelete={handleDelete} />
      ),
    },
  ];

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteReport(id);
      message.success("Reporte eliminado correctamente");
      fetchReports();
    } catch (error) {
      message.error("Error al eliminar el reporte");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Reportes Power BI</h1>
        <Link href="/reports/create">
          <Button type="primary" icon={<PlusOutlined />}>
            Nuevo Reporte
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={reports}
          loading={loading}
          rowKey="id"
          scroll={{ x: true }}
        />
      </div>
    </div>
  );
}
