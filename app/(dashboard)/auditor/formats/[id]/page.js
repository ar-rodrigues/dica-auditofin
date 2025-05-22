"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Button,
  Typography,
  Space,
  Card,
  Skeleton,
  Table,
  Tag,
  Divider,
  Row,
  Col,
  Tooltip,
  Result,
  Modal,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileExcelOutlined,
  CalendarOutlined,
  BankOutlined,
  DownloadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import AuditHeader from "@/components/common/AuditHeader";
import { useEntitiesFormats } from "@/hooks/useEntitiesFormats";
import { useFormatEntries } from "@/hooks/useFormatEntries";
import { useFormatValues } from "@/hooks/useFormatValues";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useFormatTable } from "@/hooks/useFormatTable";
import * as XLSX from "xlsx";

// Extender dayjs con los plugins de timezone y utc
dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text, Paragraph } = Typography;

// Componente para mostrar información en cajas similares a la imagen de referencia
const InfoBox = ({ icon, title, children, color = "default" }) => (
  <Card
    size="small"
    className="info-box h-full"
    style={{
      height: "100%",
      borderTop:
        color !== "default" ? `3px solid ${getColorHex(color)}` : undefined,
    }}
  >
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-2">
        {icon && <span className="mr-2">{icon}</span>}
        <Text type="secondary">{title}</Text>
      </div>
      <div className="flex-grow">
        {typeof children === "string" ? (
          <Text strong>{children}</Text>
        ) : (
          children
        )}
      </div>
    </div>
  </Card>
);

const getColorHex = (color) => {
  const colorMap = {
    success: "#52c41a",
    warning: "#faad14",
    error: "#f5222d",
    default: "#d9d9d9",
    blue: "#1677ff",
    purple: "#722ed1",
  };
  return colorMap[color] || colorMap.default;
};

export default function AuditorFormatDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Estados para almacenar los datos de la respuesta de la API
  const [entityInfo, setEntityInfo] = useState(null);
  const [auditorInfo, setAuditorInfo] = useState(null);
  const [areaInfo, setAreaInfo] = useState(null);
  const [formatInfo, setFormatInfo] = useState(null);
  const [formatHeaders, setFormatHeaders] = useState([]);
  const [formatEntries, setFormatEntries] = useState(null);
  const [formatValues, setFormatValues] = useState([]);
  const [formatStatus, setFormatStatus] = useState("");
  const [dueDate, setDueDate] = useState(null);

  const { user, loading: userLoading } = useFetchUser();

  // Hook para manejar los formatos de entidad
  const {
    entityFormat,
    loading: entityFormatLoading,
    error: entityFormatError,
    fetchEntityFormat,
    updateEntityFormat,
  } = useEntitiesFormats();

  // Hook para manejar las entradas de formato
  const { createFormatEntry } = useFormatEntries();

  // Hook para manejar los valores de formato
  const { bulkInsertFormatValues, bulkUpdateFormatValues, updateFormatValue } =
    useFormatValues();

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setIsLoading(true);
        if (!id) return;

        // Cargar toda la información del formato de entidad
        const result = await fetchEntityFormat(id);

        if (result.success && result.data) {
          const data = result.data;

          // Separar datos en estados individuales para claridad
          setEntityInfo(data.entity || {});
          setAuditorInfo(data.auditor?.auditor || {});
          setAreaInfo(data.area || {});
          setFormatInfo(data.format || {});
          setFormatHeaders(data.format?.headers || []);
          setFormatEntries(data?.format_entries?.[0] || null);

          setFormatValues(data.values || []);
          setFormatStatus(data.status || "");
          setDueDate(data.due_date || null);
        } else {
          setError("No se pudo cargar la información del formato");
        }
      } catch (error) {
        console.error("Error al cargar datos del formato:", error);
        setError("Error al cargar los datos del formato");
      } finally {
        setIsLoading(false);
      }
    };

    loadFormData();
  }, [id]);

  // Función para manejar el cambio de validez de una celda
  const handleToggleValidity = async (record, columnId) => {
    try {
      // Obtener el número de fila basado en el record.key
      const rowNumber = record.key + 2;

      // Encontrar el valor específico a actualizar
      const valueToUpdate = formatValues.find((value) => {
        const cellRowNumber = parseInt(value.cell_ref.match(/\d+/)[0]);
        return cellRowNumber === rowNumber && value.header_id.id === columnId;
      });

      if (valueToUpdate) {
        // Invertir el estado actual de is_valid
        const newIsValid = !valueToUpdate.is_valid;

        // Actualizar en la BD
        await updateFormatValue(valueToUpdate.id, {
          is_valid: newIsValid,
        });

        // Actualizar estado local
        setFormatValues((prev) =>
          prev.map((value) =>
            value.id === valueToUpdate.id
              ? { ...value, is_valid: newIsValid }
              : value
          )
        );

        message.success(
          `Valor marcado como ${newIsValid ? "válido" : "inválido"}`
        );
      } else {
        message.error("No se pudo encontrar el valor para actualizar");
      }
    } catch (error) {
      console.error("Error al actualizar la validez:", error);
      message.error("No se pudo actualizar el estado de validez");
    }
  };

  // Función para marcar toda una fila como válida o inválida
  const handleRowValidity = async (record, isValid) => {
    try {
      // Encontrar todos los valores de la fila
      // La estructura de cell_ref es similar a "A4", "B4", "C4" donde el número es la fila
      const rowNumber = record.key + 2; // Ajuste basado en la estructura de los datos

      const rowValues = formatValues.filter((value) => {
        // Extraer el número de fila del cell_ref (ej: de "A4" extraer "4")
        const cellRowNumber = parseInt(value.cell_ref.match(/\d+/)[0]);
        return cellRowNumber === rowNumber;
      });

      if (rowValues.length > 0) {
        // Preparar actualización masiva
        const updatedValues = rowValues.map((value) => ({
          id: value.id,
          is_valid: isValid,
        }));

        // Actualizar en la BD
        await bulkUpdateFormatValues(updatedValues);

        // Actualizar estado local
        setFormatValues((prev) =>
          prev.map((value) =>
            rowValues.some((rv) => rv.id === value.id)
              ? { ...value, is_valid: isValid }
              : value
          )
        );

        message.success(`Fila marcada como ${isValid ? "válida" : "inválida"}`);
      } else {
        message.error("No se encontraron valores para esta fila");
      }
    } catch (error) {
      console.error("Error al actualizar la validez de la fila:", error);
      message.error("No se pudo actualizar el estado de validez de la fila");
    }
  };

  // Función para aprobar el formato
  const handleApproveFormat = async () => {
    try {
      // Actualizar el estado del formato a "aprobado"
      const result = await updateEntityFormat(id, { status: "aprobado" });

      if (result.success) {
        message.success("Formato aprobado correctamente");
        setFormatStatus("aprobado");
        setApproveModalVisible(false);
      } else {
        message.error("No se pudo aprobar el formato");
      }
    } catch (error) {
      console.error("Error al aprobar el formato:", error);
      message.error("Error al aprobar el formato");
    }
  };

  // Función para rechazar el formato
  const handleRejectFormat = async () => {
    try {
      // Actualizar el estado del formato a "faltante"
      const result = await updateEntityFormat(id, {
        status: "faltante",
        auditor_comments: rejectReason,
      });

      if (result.success) {
        message.success("Formato rechazado correctamente");
        setFormatStatus("faltante");
        setRejectModalVisible(false);
      } else {
        message.error("No se pudo rechazar el formato");
      }
    } catch (error) {
      console.error("Error al rechazar el formato:", error);
      message.error("Error al rechazar el formato");
    }
  };

  // Función para descargar los datos como Excel
  const handleDownloadExcel = () => {
    try {
      // Crear un libro de trabajo
      const wb = XLSX.utils.book_new();

      // Preparar los datos para el Excel
      const excelData = formattedData.map((row) => {
        const excelRow = {};

        // Añadir todas las columnas excepto la columna de acciones
        tableColumns.forEach((column) => {
          if (column.dataIndex !== "actions") {
            excelRow[column.title] = row[column.dataIndex];
          }
        });

        return excelRow;
      });

      // Crear una hoja de trabajo con los datos
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Añadir la hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, formatInfo?.name || "Formato");

      // Guardar el archivo
      XLSX.writeFile(
        wb,
        `${formatInfo?.name || "Formato"}_${entityInfo?.entity_name || ""}.xlsx`
      );

      message.success("Archivo Excel descargado correctamente");
    } catch (error) {
      console.error("Error al descargar el Excel:", error);
      message.error("No se pudo descargar el archivo Excel");
    }
  };

  // Modificar las columnas de la tabla para incluir la funcionalidad de validación
  const getTableColumns = () => {
    // Si no estamos en estado "pendiente", devolver las columnas originales
    if (formatStatus !== "pendiente") {
      return tableColumns;
    }

    // Añadir estilo condicional a las celdas basado en is_valid
    const columnsWithValidation = tableColumns.map((column) => {
      if (column.dataIndex === "actions") return column;

      return {
        ...column,
        render: (text, record) => {
          // Encontrar el valor correspondiente a esta celda
          const rowNumber = record.key + 2; // Ajuste basado en la estructura de los datos
          const columnName = column.title;

          // Buscar el valor por cell_ref y header
          const cellValue = formatValues.find((value) => {
            const cellRowNumber = parseInt(value.cell_ref.match(/\d+/)[0]);
            return (
              cellRowNumber === rowNumber &&
              value.header_id.header === columnName
            );
          });

          // Si no hay valor o no es editable, mostrar el texto normal
          if (!cellValue) return text;

          // Estilo basado en la validez
          const style = {
            backgroundColor:
              cellValue.is_valid === false
                ? "#ffccc7"
                : cellValue.is_valid === true
                ? "#d9f7be"
                : "transparent",
            padding: "8px",
            borderRadius: "4px",
            cursor: "pointer",
          };

          return (
            <div
              style={style}
              onClick={() =>
                handleToggleValidity(record, cellValue.header_id.id)
              }
            >
              {text}
            </div>
          );
        },
      };
    });

    // Añadir columna de acciones para validar/invalidar toda la fila
    return [
      ...columnsWithValidation,
      {
        title: "Acciones",
        key: "row-actions",
        render: (_, record) => {
          // Verificar si todos los valores de la fila son válidos
          const rowNumber = record.key + 2;
          const rowValues = formatValues.filter((value) => {
            const cellRowNumber = parseInt(value.cell_ref.match(/\d+/)[0]);
            return cellRowNumber === rowNumber;
          });

          const allValid =
            rowValues.length > 0 &&
            rowValues.every((value) => value.is_valid === true);

          return (
            <Button
              type={allValid ? "default" : "primary"}
              size="small"
              onClick={() => handleRowValidity(record, !allValid)}
            >
              {allValid ? "Invalidar" : "Validar"}
            </Button>
          );
        },
      },
    ];
  };

  // Usar el hook para obtener las columnas y datos de la tabla
  const { columns: tableColumns, dataSource: formattedData } = useFormatTable(
    formatValues,
    formatHeaders
  );

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    const statusColors = {
      asignado: "blue",
      pendiente: "orange",
      faltante: "red",
      aprobado: "green",
    };
    return statusColors[status] || "default";
  };

  const getStatusLabel = (status) => {
    const statusLabels = {
      asignado: "Asignado",
      pendiente: "Pendiente",
      faltante: "Faltante",
      aprobado: "Aprobado",
    };
    return statusLabels[status] || "-";
  };

  if (isLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton active />
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6">
        <Space className="mb-4">
          <Button
            type="default"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/auditor/formats")}
          >
            Volver
          </Button>
        </Space>

        <AuditHeader
          title={formatInfo?.name || "Formato"}
          subtitle="Revisión y validación de formato"
          entityName={entityInfo?.entity_name || ""}
        />

        {/* Información del formato */}
        <Card className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <InfoBox icon={<BankOutlined />} title="Entidad" color="blue">
                {entityInfo?.entity_name || "-"}
              </InfoBox>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <InfoBox icon={<FileExcelOutlined />} title="Área">
                {areaInfo?.area || "-"}
              </InfoBox>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <InfoBox
                icon={<CalendarOutlined />}
                title="Fecha de entrega"
                color={dueDate ? "warning" : "default"}
              >
                {formatDate(dueDate)}
              </InfoBox>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <InfoBox
                icon={<CheckCircleOutlined />}
                title="Estado"
                color={getStatusColor(formatStatus)}
              >
                <Tag color={getStatusColor(formatStatus)}>
                  {getStatusLabel(formatStatus)}
                </Tag>
              </InfoBox>
            </Col>
          </Row>
        </Card>

        {/* Tabla de datos */}
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Title level={4} className="mb-0">
              Datos del formato
            </Title>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadExcel}
            >
              Descargar Excel
            </Button>
          </div>

          <Table
            columns={getTableColumns()}
            dataSource={formattedData}
            bordered
            size="small"
            scroll={{ x: true }}
            pagination={{ pageSize: 10 }}
          />
        </Card>

        {/* Acciones del auditor */}
        <Card className="mb-6">
          <Title level={4} className="mb-4">
            Acciones
          </Title>
          <Space>
            {formatStatus === "pendiente" && (
              <>
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => setApproveModalVisible(true)}
                >
                  Aprobar Formato
                </Button>
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => setRejectModalVisible(true)}
                >
                  Rechazar Formato
                </Button>
              </>
            )}
            {formatStatus === "asignado" && (
              <Button type="default" icon={<ExclamationCircleOutlined />}>
                Ver Formato
              </Button>
            )}
            {formatStatus === "faltante" && (
              <Button type="default" icon={<ExclamationCircleOutlined />}>
                Ver Formato
              </Button>
            )}
            {formatStatus === "aprobado" && (
              <Button type="default" icon={<CheckCircleOutlined />}>
                Ver Formato
              </Button>
            )}
          </Space>
        </Card>
      </div>

      {/* Modal de confirmación para aprobar */}
      <Modal
        title="Confirmar aprobación"
        open={approveModalVisible}
        onOk={handleApproveFormat}
        onCancel={() => setApproveModalVisible(false)}
        okText="Aprobar"
        cancelText="Cancelar"
      >
        <p>¿Está seguro que desea aprobar este formato?</p>
      </Modal>

      {/* Modal para rechazar con razón */}
      <Modal
        title="Rechazar formato"
        open={rejectModalVisible}
        onOk={handleRejectFormat}
        onCancel={() => setRejectModalVisible(false)}
        okText="Rechazar"
        cancelText="Cancelar"
      >
        <p>Indique la razón por la cual rechaza este formato:</p>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Razón del rechazo"
        />
      </Modal>
    </div>
  );
}
