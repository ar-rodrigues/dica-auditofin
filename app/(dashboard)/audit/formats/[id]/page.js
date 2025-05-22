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
  Upload,
  message,
  Divider,
  Modal,
  Alert,
  Tag,
  Empty,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  UploadOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FileExcelOutlined,
  CalendarOutlined,
  FileOutlined,
  BankOutlined,
} from "@ant-design/icons";
import AuditHeader from "@/components/common/AuditHeader";
import { useEntitiesFormats } from "@/hooks/useEntitiesFormats";
import { useFormatEntries } from "@/hooks/useFormatEntries";
import { useFormatValues } from "@/hooks/useFormatValues";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useFetchUser } from "@/hooks/useFetchUser";
import { useFormatTable } from "@/hooks/useFormatTable";

// Extender dayjs con los plugins de timezone y utc
dayjs.extend(utc);
dayjs.extend(timezone);

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

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

export default function FormatFillPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  // Las columnas para la tabla de archivos cargados, no para los datos guardados
  const [previewTableColumns, setPreviewTableColumns] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [savingData, setSavingData] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

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
  const { bulkInsertFormatValues, bulkUpdateFormatValues } = useFormatValues();

  useEffect(() => {
    const loadFormData = async () => {
      try {
        setIsLoading(true);
        if (!id) return;

        // Cargar toda la información del formato de entidad con la nueva estructura de API
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

          // Los datos de la tabla ahora se manejan a través del hook useFormatTable
        } else {
          message.error("No se pudo cargar la información del formato");
        }
      } catch (error) {
        console.error("Error al cargar datos del formato:", error);
        message.error("Error al cargar los datos del formato");
      } finally {
        setIsLoading(false);
      }
    };

    loadFormData();
  }, [id]);

  // Usar el hook para obtener las columnas y datos de la tabla
  const { columns: tableColumnsFromHook, dataSource: formattedDataFromHook } =
    useFormatTable(formatValues, formatHeaders);

  // Preparar columnas para la tabla cuando cambian los headers o los datos cargados
  // Generar columnas para la vista previa del archivo cargado
  useEffect(() => {
    if (tableData.length > 0) {
      // Obtener los encabezados del primer objeto de datos, excluyendo los campos técnicos
      const fileHeaders = Object.keys(tableData[0]).filter(
        (header) => !header.endsWith("_cell_ref") && header !== "__hasError"
      );

      // Crear las columnas para la tabla de vista previa
      const columns = fileHeaders.map((header) => ({
        title: header,
        dataIndex: header,
        key: header,
        align: "left",
        render: (text, record, index) => {
          const hasError = validationErrors.some(
            (err) => err.row === index + 1 && err.column === header
          );

          return (
            <div
              style={{
                backgroundColor: hasError ? "#fff2f0" : "transparent",
                padding: hasError ? "4px 8px" : "0",
                border: hasError ? "1px solid #ffccc7" : "none",
                borderRadius: hasError ? "2px" : "0",
              }}
            >
              {text !== undefined && text !== "" ? (
                text
              ) : (
                <span style={{ color: "#ff4d4f" }}>Vacío</span>
              )}
              {hasError && (
                <Tooltip
                  title={
                    validationErrors.find(
                      (err) => err.row === index + 1 && err.column === header
                    )?.message
                  }
                >
                  <InfoCircleOutlined
                    style={{ color: "#ff4d4f", marginLeft: 8 }}
                  />
                </Tooltip>
              )}
            </div>
          );
        },
      }));

      setPreviewTableColumns(columns);
    }
  }, [tableData, validationErrors]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadTemplate = () => {
    if (!formatHeaders || formatHeaders.length === 0) {
      message.error(
        "No se pudo descargar la plantilla: No hay encabezados definidos"
      );
      return;
    }

    try {
      // Obtener los encabezados del formato ordenados
      const headers = [...formatHeaders].sort((a, b) => a.order - b.order);

      // Crear una hoja de trabajo con solo los encabezados
      const worksheet = XLSX.utils.aoa_to_sheet([headers.map((h) => h.header)]);

      // Crear libro y agregar la hoja
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

      // Obtener nombre del formato para el archivo
      const formatName = formatInfo?.name || `Formato_${id}`;
      const safeFormatName = formatName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();

      // Descargar el archivo
      XLSX.writeFile(workbook, `${safeFormatName}_template.xlsx`);

      message.success("Plantilla descargada correctamente");
    } catch (error) {
      console.error("Error al generar plantilla:", error);
      message.error("Error al generar la plantilla: " + error.message);
    }
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        // Leer el archivo Excel
        const workbook = XLSX.read(data, { type: "array" });

        // Obtener la primera hoja
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

        // Obtener el rango de la hoja
        const range = XLSX.utils.decode_range(firstSheet["!ref"]);

        // Detectar encabezados de la primera fila
        const excelHeaders = [];
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: C });
          const cell = firstSheet[cellAddress];
          if (cell && cell.v) {
            excelHeaders.push(String(cell.v).trim());
          }
        }

        //console.log("Excel headers detected:", excelHeaders);

        if (excelHeaders.length === 0) {
          message.error("No se detectaron encabezados en el archivo Excel");
          return;
        }

        // Convertir el resto de la hoja a JSON usando los encabezados detectados
        // Comenzamos desde la segunda fila para excluir los encabezados
        const rows = [];
        for (let R = range.s.r + 1; R <= range.e.r; ++R) {
          const row = {};
          let isEmpty = true;

          for (let C = range.s.c; C <= range.e.c; ++C) {
            // Solo procesamos columnas que tienen encabezados
            if (C < excelHeaders.length) {
              const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
              const cell = firstSheet[cellAddress];
              const headerName = excelHeaders[C];

              if (cell && cell.v !== undefined && cell.v !== null) {
                row[headerName] = cell.v;
                // Almacenar la referencia de celda (por ejemplo A3, B2, etc.)
                row[`${headerName}_cell_ref`] = cellAddress;
                isEmpty = false;
              } else {
                row[headerName] = "";
                row[`${headerName}_cell_ref`] = cellAddress;
              }
            }
          }

          // Solo agregar filas que no estén vacías
          if (!isEmpty) {
            rows.push(row);
          }
        }

        if (rows.length === 0) {
          message.error(
            "No se encontraron datos en el archivo (excluyendo encabezados)"
          );
          return;
        }

        //console.log("Parsed data rows:", rows);

        // Realizar validación si hay encabezados definidos en el formato
        const errors = [];

        if (formatHeaders && formatHeaders.length > 0) {
          console.log(
            "Format headers expected:",
            formatHeaders.map((h) => h.header)
          );

          // Validar cada fila
          rows.forEach((row, rowIndex) => {
            let rowHasError = false;

            // Validar contra cada encabezado de formato esperado
            formatHeaders.forEach((formatHeader) => {
              const formatHeaderNormalized = formatHeader.header
                .toLowerCase()
                .replace(/\s+/g, "");

              // Buscar el encabezado correspondiente en el Excel
              const matchingExcelHeader = excelHeaders.find(
                (h) =>
                  h.toLowerCase().replace(/\s+/g, "") === formatHeaderNormalized
              );

              if (!matchingExcelHeader) return; // Este encabezado no está en el archivo

              const value = row[matchingExcelHeader];

              // Validación básica: campo requerido
              if (value === undefined || value === null || value === "") {
                errors.push({
                  row: rowIndex + 1,
                  column: matchingExcelHeader,
                  message: "Campo requerido",
                  value: value,
                });
                rowHasError = true;
              }
              // Validación de tipo
              else if (formatHeader.type) {
                switch (formatHeader.type.toLowerCase()) {
                  case "number":
                    if (isNaN(Number(value))) {
                      errors.push({
                        row: rowIndex + 1,
                        column: matchingExcelHeader,
                        message: "Debe ser un número",
                        value: value,
                      });
                      rowHasError = true;
                    }
                    break;
                  case "date":
                    if (isNaN(new Date(value).getTime())) {
                      errors.push({
                        row: rowIndex + 1,
                        column: matchingExcelHeader,
                        message: "Formato de fecha inválido",
                        value: value,
                      });
                      rowHasError = true;
                    }
                    break;
                }
              }
            });

            // Marcar fila con error
            if (rowHasError) {
              row.__hasError = true;
            }
          });
        } else {
          console.log("No format headers defined, skipping validation");
        }

        // Establecer los datos para la vista previa
        setTableData(rows);
        setValidationErrors(errors);
        setShowPreview(true);

        // Mostrar mensajes según el resultado
        if (errors.length > 0) {
          message.warning(
            `Se encontraron ${errors.length} errores en los datos. Revise la tabla.`
          );
        } else {
          message.success(
            "Archivo cargado correctamente. Revise los datos antes de guardar."
          );
        }
      } catch (error) {
        console.error("Error procesando archivo:", error);
        message.error("Error al procesar el archivo: " + error.message);
      }
    };

    reader.readAsArrayBuffer(file);
    return false; // Prevenir upload automático
  };

  const handleSaveData = async () => {
    if (validationErrors.length > 0) {
      message.error("Por favor corrija los errores antes de guardar");
      return;
    }

    if (!tableData || tableData.length === 0) {
      message.error("No hay datos para guardar");
      return;
    }

    // Verificar si el estado permite edición
    if (formatStatus === "pendiente" || formatStatus === "aprobado") {
      message.error(
        "No se pueden guardar cambios mientras el formato está en estado de revisión o aprobado"
      );
      return;
    }

    // Verificar que existan encabezados de formato definidos
    if (!formatHeaders || formatHeaders.length === 0) {
      message.error(
        "No hay encabezados definidos para este formato. No se pueden guardar los datos."
      );
      return;
    }

    setSavingData(true);
    console.log("Iniciando proceso de guardado de datos");

    try {
      // Obtener IDs necesarios
      if (!id || !formatInfo?.id) {
        throw new Error(
          "Información del formato incompleta. No se puede guardar."
        );
      }

      const formatId = formatInfo.id;
      const formatEntriesId = formatEntries?.id;
      const entityFormatId = id;

      let entryId;
      let entryVersion = 1;
      let isNewEntry = false;

      // Comprobar si ya existe una entrada o crear una nueva
      if (formatEntries) {
        // Existe una entrada previa, crear nueva versión
        entryVersion = formatEntries.version + 1;
        console.log(
          `Creando nueva versión. Versión anterior: ${formatEntries.version}`
        );
        isNewEntry = false;
      } else {
        // No existe entrada previa, crear primera versión
        console.log("Creando primera entrada de formato");
        isNewEntry = true;
      }

      // Crear nueva entrada o actualizar la existente
      if (isNewEntry) {
        const entryResult = await createFormatEntry({
          entities_formats_id: entityFormatId,
          version: entryVersion,
          modified_by: user?.id,
          modified_at: dayjs().tz("America/Mexico_City").toISOString(),
        });

        if (!entryResult.success) {
          throw new Error(
            "Error al crear la entrada de formato: " + entryResult.error
          );
        }

        entryId = entryResult.data.id;
        console.log(
          `Nueva entrada creada con ID: ${entryId}, Versión: ${entryVersion}`
        );
      } else {
        entryId = formatEntriesId;
        console.log(`Actualizando entrada existente con ID: ${entryId}`);
      }

      // Preparar mapeo entre encabezados del Excel y los IDs de formato
      const headerMap = new Map();
      console.log(`Procesando ${formatHeaders.length} encabezados de formato`);

      // Normalizar los encabezados de Excel que tenemos en los datos
      const excelHeaders = Object.keys(tableData[0]).filter(
        (key) => !key.endsWith("_cell_ref")
      );
      console.log(
        `Encabezados detectados en archivo: ${excelHeaders.join(", ")}`
      );

      // Mapear cada encabezado de formato a su correspondiente en el Excel
      formatHeaders.forEach((formatHeader) => {
        const formatNormalized = formatHeader.header
          .toLowerCase()
          .replace(/\s+/g, "");

        // Buscar coincidencia
        const matchingExcelHeader = excelHeaders.find(
          (excelHeader) =>
            excelHeader.toLowerCase().replace(/\s+/g, "") === formatNormalized
        );

        if (matchingExcelHeader) {
          headerMap.set(matchingExcelHeader, formatHeader.id);
          console.log(
            `Mapeo: "${matchingExcelHeader}" -> ID: ${formatHeader.id}`
          );
        } else {
          console.log(
            `No se encontró coincidencia para encabezado: ${formatHeader.header}`
          );
        }
      });

      if (headerMap.size === 0) {
        throw new Error(
          "No se pudo mapear ningún encabezado. Verifica que los nombres coincidan."
        );
      }

      // Preparar valores para inserción o actualización
      const valuesForInsert = [];
      const existingValuesMap = new Map();

      // Si hay valores existentes, crear un mapa para facilitar la actualización
      if (formatValues && formatValues.length > 0) {
        formatValues.forEach((value) => {
          // Si existe cell_ref, usarlo como clave para mapear
          if (value.cell_ref) {
            existingValuesMap.set(value.cell_ref, value);
          } else {
            // De lo contrario, usar el header_id como antes
            const key = `${value.header_id.id}`;
            existingValuesMap.set(key, value);
          }
        });
      }

      // Preparar los valores para insertar o actualizar
      tableData.forEach((row, rowIndex) => {
        excelHeaders.forEach((header) => {
          const headerId = headerMap.get(header);
          if (headerId && row[header] !== undefined) {
            const cellRef = row[`${header}_cell_ref`];
            const valueKey = cellRef || `${headerId}`;
            const existingValue = existingValuesMap.get(valueKey);

            if (existingValue) {
              // Actualizar valor existente
              valuesForInsert.push({
                id: existingValue.id,
                entry_id: entryId,
                header_id: headerId,
                value: String(row[header]),
                cell_ref: cellRef,
                entities_formats_id: entityFormatId,
              });
            } else {
              // Crear nuevo valor
              valuesForInsert.push({
                entry_id: entryId,
                header_id: headerId,
                value: String(row[header]),
                cell_ref: cellRef,
                entities_formats_id: entityFormatId,
              });
            }
          }
        });
      });

      console.log(`Preparados ${valuesForInsert.length} valores para guardar`);

      // Separar valores a insertar y a actualizar
      const valuesToInsert = valuesForInsert.filter((v) => !v.id);
      const valuesToUpdate = valuesForInsert.filter((v) => v.id);

      // Insertar nuevos valores si los hay
      if (valuesToInsert.length > 0) {
        const insertResult = await bulkInsertFormatValues(valuesToInsert);
        if (!insertResult.success) {
          throw new Error(
            "Error al insertar nuevos valores: " + insertResult.error
          );
        }
        console.log(
          `${valuesToInsert.length} nuevos valores insertados correctamente`
        );
      }

      // Actualizar valores existentes si los hay
      if (valuesToUpdate.length > 0) {
        const updateResult = await bulkUpdateFormatValues(valuesToUpdate);
        if (!updateResult.success) {
          throw new Error(
            "Error al actualizar valores existentes: " + updateResult.error
          );
        }
        console.log(
          `${valuesToUpdate.length} valores actualizados correctamente`
        );
      }

      message.success("Datos guardados correctamente");

      // Refrescar datos tras guardar
      const refreshResult = await fetchEntityFormat(entityFormatId);
      if (refreshResult.success && refreshResult.data) {
        // Actualizar todos los estados con los datos frescos
        setEntityInfo(refreshResult.data.entity || {});
        setAuditorInfo(refreshResult.data.auditor?.auditor || {});
        setAreaInfo(refreshResult.data.area || {});
        setFormatInfo(refreshResult.data.format || {});
        setFormatHeaders(refreshResult.data.format?.headers || []);
        setFormatEntries(refreshResult.data?.format_entries?.[0] || null);
        setFormatValues(refreshResult.data.values || []);

        // Los datos de la tabla se actualizarán automáticamente a través del hook useFormatTable
      }

      // Limpiar vista previa
      setShowPreview(false);
      setTableData([]);
      setUploadedFile(null);
      setValidationErrors([]);
    } catch (error) {
      console.error("Error guardando datos:", error);
      message.error("Error al guardar los datos: " + error.message);
    } finally {
      setSavingData(false);
    }
  };

  const handleSubmitFormat = async () => {
    try {
      if (!id) {
        throw new Error("No se ha cargado el formato");
      }

      // Verificar que existan datos guardados antes de enviar
      if (!formatEntries) {
        message.warning("Debe guardar datos antes de enviar para revisión");
        return;
      }

      // Actualizar el estado del formato a "pendiente"
      const updateResult = await updateEntityFormat(id, {
        status: "pendiente",
      });

      if (!updateResult.success) {
        throw new Error("Error al actualizar el estado del formato");
      }

      // Actualizar estado local
      setFormatStatus("pendiente");

      message.success("Formato enviado correctamente para revisión");
      setSubmitModalVisible(false);

      // Redireccionar a la página de formatos
      router.push("/audit/formats");
    } catch (error) {
      console.error("Error al enviar formato:", error);
      message.error("Error al enviar formato: " + error.message);
      setSubmitModalVisible(false);
    }
  };

  const isEditingDisabled =
    formatStatus === "pendiente" || formatStatus === "aprobado";

  if (isLoading || entityFormatLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (!formatInfo && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="mx-auto flex flex-col">
          <Card className="text-center p-8">
            <Title level={3}>Formato no encontrado</Title>
            <p className="text-gray-600 mb-6">
              El formato que buscas no existe o ha sido eliminado.
            </p>
            <Button
              type="primary"
              onClick={() => router.push("/audit/formats")}
            >
              Volver a formatos
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Determinar el color del estado
  const getStatusColor = (status) => {
    switch (status) {
      case "asignado":
        return "blue";
      case "pendiente":
        return "warning";
      case "aprobado":
        return "success";
      case "faltante":
        return "error";
      default:
        return "default";
    }
  };

  const statusColor = getStatusColor(formatStatus);
  const statusText =
    {
      asignado: "Pendiente de llenado",
      pendiente: "En revisión",
      aprobado: "Aprobado",
      faltante: "Faltante",
    }[formatStatus] || formatStatus;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <AuditHeader
          title={`Formato: ${formatInfo?.name || "Cargando..."}`}
          subtitle="Completar y enviar formato para revisión"
        />

        <div className="mt-8">
          <Card className="shadow-md rounded-lg mb-8">
            <Space className="mb-6">
              <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push("/audit/formats")}
              >
                Volver a formatos
              </Button>
            </Space>

            {/* Información del formato */}
            <div className="mb-6">
              <Title level={4}>{formatInfo?.name}</Title>
              <Paragraph>
                {formatInfo?.description || "Sin descripción"}
              </Paragraph>

              <Divider />

              {/* Cajas de información similares a la imagen de referencia */}
              <Row gutter={[16, 16]} className="mb-8">
                <Col xs={24} sm={12} md={8} lg={6}>
                  <InfoBox
                    icon={<UserOutlined />}
                    title="Auditor asignado"
                    color="blue"
                  >
                    {`${auditorInfo?.first_name || ""} ${
                      auditorInfo?.last_name || ""
                    }`}
                  </InfoBox>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <InfoBox
                    icon={<CalendarOutlined />}
                    title="Fecha de vencimiento"
                    color="warning"
                  >
                    {dueDate
                      ? formatDate(dueDate).split(",")[0]
                      : "No definida"}
                  </InfoBox>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <InfoBox
                    icon={<FileOutlined />}
                    title="Estado"
                    color={statusColor}
                  >
                    {statusText}
                  </InfoBox>
                </Col>

                <Col xs={24} sm={12} md={8} lg={6}>
                  <InfoBox icon={<BankOutlined />} title="Entidad">
                    {entityInfo?.entity_name || "Sin entidad"}
                  </InfoBox>
                </Col>
              </Row>

              {formatEntries && (
                <Row gutter={[16, 16]} className="mb-8">
                  <Col xs={24} sm={12} md={8}>
                    <InfoBox
                      icon={<ClockCircleOutlined />}
                      title="Última modificación"
                    >
                      {formatDate(formatEntries.modified_at)}
                    </InfoBox>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <InfoBox icon={<UserOutlined />} title="Modificado por">
                      {`${formatEntries.modified_by.first_name} ${formatEntries.modified_by.last_name}`}
                    </InfoBox>
                  </Col>

                  <Col xs={24} sm={12} md={8}>
                    <InfoBox title="Versión" color="purple">
                      <Tag color="purple">Versión {formatEntries.version}</Tag>
                    </InfoBox>
                  </Col>
                </Row>
              )}

              <Space direction="vertical" size="large" className="w-full">
                {isEditingDisabled && (
                  <Alert
                    message={
                      formatStatus === "pendiente"
                        ? "Formato en revisión"
                        : "Formato aprobado"
                    }
                    description={
                      formatStatus === "pendiente"
                        ? "Este formato está siendo revisado y no puede ser modificado por el momento."
                        : "Este formato ha sido aprobado y no puede ser modificado."
                    }
                    type={formatStatus === "pendiente" ? "warning" : "success"}
                    showIcon
                    className="mb-4"
                  />
                )}

                {validationErrors.length > 0 && (
                  <Alert
                    message="Errores de validación"
                    description={
                      <div>
                        <ul>
                          {validationErrors
                            .filter((err) => err.column !== "debug")
                            .slice(0, 5)
                            .map((error, index) => (
                              <li key={index}>
                                {error.row === 0 ? (
                                  <strong>
                                    Error de formato: {error.message}
                                  </strong>
                                ) : (
                                  `Fila ${error.row}, Columna "${error.column}": ${error.message}`
                                )}
                              </li>
                            ))}
                          {validationErrors.filter(
                            (err) => err.column !== "debug"
                          ).length > 5 && (
                            <li>
                              ...y{" "}
                              {validationErrors.filter(
                                (err) => err.column !== "debug"
                              ).length - 5}{" "}
                              errores más
                            </li>
                          )}
                        </ul>

                        {validationErrors.some(
                          (err) => err.column === "debug"
                        ) && (
                          <div className="mt-2 p-2 bg-gray-100 rounded">
                            <Text
                              type="secondary"
                              style={{ fontSize: "0.8rem" }}
                            >
                              Información de depuración:
                            </Text>
                            <ul className="mt-1">
                              {validationErrors
                                .filter((err) => err.column === "debug")
                                .map((error, index) => (
                                  <li
                                    key={index}
                                    style={{ fontSize: "0.8rem" }}
                                  >
                                    {error.message}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    }
                    type="error"
                    showIcon
                    className="mb-4"
                  />
                )}

                {showPreview ? (
                  <div>
                    <Alert
                      message={
                        validationErrors.length > 0
                          ? "Revisión pendiente"
                          : "Datos listos para guardar"
                      }
                      description={
                        validationErrors.length > 0 ? (
                          <div>
                            <p>
                              Los datos contienen errores que deben corregirse
                              antes de guardar:
                            </p>
                            <ul className="mt-2 max-h-40 overflow-y-auto">
                              {validationErrors
                                .slice(0, 5)
                                .map((error, index) => (
                                  <li key={index} className="text-red-500">
                                    Fila {error.row}, Columna &ldquo;
                                    {error.column}&rdquo;: {error.message}
                                  </li>
                                ))}
                              {validationErrors.length > 5 && (
                                <li className="text-gray-500">
                                  ...y {validationErrors.length - 5} errores más
                                </li>
                              )}
                            </ul>
                            <p className="mt-2">
                              Por favor corrija los errores en el archivo
                              original y vuelva a cargarlo.
                            </p>
                          </div>
                        ) : (
                          <p>
                            Los datos han pasado la validación y están listos
                            para guardar. Revise la información antes de
                            confirmar.
                          </p>
                        )
                      }
                      type={validationErrors.length > 0 ? "warning" : "success"}
                      showIcon
                      className="mb-6"
                    />

                    <Card
                      title={
                        <div className="flex items-center justify-between">
                          <span>Vista previa de datos</span>
                          <Tag
                            color={
                              validationErrors.length > 0
                                ? "warning"
                                : "success"
                            }
                          >
                            {validationErrors.length > 0
                              ? `${validationErrors.length} errores encontrados`
                              : "Datos válidos"}
                          </Tag>
                        </div>
                      }
                      className="mb-6"
                    >
                      <div className="mb-3 text-sm text-gray-500">
                        <InfoCircleOutlined className="mr-1" />
                        Esta es una vista previa de los datos que se guardarán.
                        Verifique que la información sea correcta.
                      </div>
                      <Table
                        columns={previewTableColumns}
                        dataSource={tableData.map((item, index) => {
                          // Filtrar propiedades que terminan en _cell_ref antes de renderizar
                          const filteredItem = {};
                          Object.keys(item).forEach((key) => {
                            if (
                              !key.endsWith("_cell_ref") &&
                              key !== "__hasError"
                            ) {
                              filteredItem[key] = item[key];
                            }
                          });
                          return {
                            ...filteredItem,
                            key: index,
                          };
                        })}
                        scroll={{ x: "max-content", y: 400 }}
                        pagination={{ pageSize: 10 }}
                        size="small"
                        style={{ width: "100%", overflowX: "auto" }}
                        rowClassName={(record) =>
                          record.__hasError ? "bg-red-50" : ""
                        }
                        summary={() => (
                          <Table.Summary fixed>
                            <Table.Summary.Row>
                              <Table.Summary.Cell
                                index={0}
                                colSpan={previewTableColumns.length}
                              >
                                <div className="flex justify-between items-center">
                                  <Text type="secondary">
                                    Total: {tableData.length} filas
                                  </Text>
                                  {validationErrors.length > 0 ? (
                                    <Text type="danger">
                                      Se encontraron errores que deben
                                      corregirse
                                    </Text>
                                  ) : (
                                    <Text type="success">
                                      Todos los datos son válidos
                                    </Text>
                                  )}
                                </div>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          </Table.Summary>
                        )}
                      />

                      <Space className="mt-4">
                        <Button
                          onClick={() => {
                            setShowPreview(false);
                            setTableData([]);
                            setUploadedFile(null);
                            setValidationErrors([]);
                          }}
                        >
                          Subir otro archivo
                        </Button>

                        <Button
                          type="primary"
                          icon={<SaveOutlined />}
                          onClick={handleSaveData}
                          loading={savingData}
                          disabled={
                            validationErrors.length > 0 || isEditingDisabled
                          }
                        >
                          Guardar datos
                        </Button>
                      </Space>
                    </Card>
                  </div>
                ) : (
                  <div>
                    <Card className="mb-4" size="small">
                      <Row gutter={[8, 8]} className="mb-2">
                        <Col span={24}>
                          <Text strong>
                            <InfoCircleOutlined className="mr-1" /> Proceso para
                            completar tu auditoría:
                          </Text>
                        </Col>

                        <Col span={24} md={24}>
                          <div className="flex items-center mb-1">
                            <div className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-100 mr-2">
                              <DownloadOutlined
                                style={{ fontSize: "12px", color: "#1677ff" }}
                              />
                            </div>
                            <Text>
                              <Text strong className="mr-1">
                                1.
                              </Text>{" "}
                              Descarga la plantilla
                            </Text>
                          </div>

                          <div className="flex items-center mb-1">
                            <div className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-100 mr-2">
                              <FileExcelOutlined
                                style={{ fontSize: "12px", color: "#52c41a" }}
                              />
                            </div>
                            <Text>
                              <Text strong className="mr-1">
                                2.
                              </Text>{" "}
                              Completa la información en Excel
                            </Text>
                          </div>

                          <div className="flex items-center mb-1">
                            <div className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-100 mr-2">
                              <UploadOutlined
                                style={{ fontSize: "12px", color: "#1677ff" }}
                              />
                            </div>
                            <Text>
                              <Text strong className="mr-1">
                                3.
                              </Text>{" "}
                              Sube el archivo
                            </Text>
                          </div>

                          <div className="flex items-center mb-1">
                            <div className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-100 mr-2">
                              <SaveOutlined
                                style={{ fontSize: "12px", color: "#1677ff" }}
                              />
                            </div>
                            <Text>
                              <Text strong className="mr-1">
                                4.
                              </Text>{" "}
                              Verifica y guarda los datos
                            </Text>
                          </div>

                          <div className="flex items-center">
                            <div className="flex justify-center items-center w-6 h-6 rounded-full bg-blue-100 mr-2">
                              <CheckCircleOutlined
                                style={{ fontSize: "12px", color: "#f5222d" }}
                              />
                            </div>
                            <Text>
                              <Text strong className="mr-1">
                                5.
                              </Text>{" "}
                              Envía para revisión al finalizar
                            </Text>
                          </div>
                        </Col>
                      </Row>

                      <Space className="mt-2">
                        <Button
                          type="primary"
                          icon={<DownloadOutlined />}
                          onClick={handleDownloadTemplate}
                          disabled={
                            !formatHeaders || formatHeaders.length === 0
                          }
                          size="small"
                        >
                          Descargar plantilla
                        </Button>
                      </Space>
                    </Card>

                    <div className="mt-8">
                      {!isEditingDisabled ? (
                        <Dragger
                          name="file"
                          multiple={false}
                          beforeUpload={handleFileUpload}
                          accept=".xlsx,.xls,.csv"
                          showUploadList={false}
                        >
                          <p className="ant-upload-drag-icon">
                            <FileExcelOutlined
                              style={{ fontSize: 48, color: "#52c41a" }}
                            />
                          </p>
                          <p className="ant-upload-text">
                            Haz clic o arrastra un archivo Excel/CSV para
                            subirlo
                          </p>
                          <p className="ant-upload-hint">
                            Solo se admiten archivos de Excel (.xlsx, .xls) o
                            CSV
                          </p>
                        </Dragger>
                      ) : (
                        <Empty
                          description={
                            <span className="text-gray-500">
                              No se pueden cargar datos cuando el formato está
                              en estado{" "}
                              {formatStatus === "pendiente"
                                ? "de revisión"
                                : "aprobado"}
                            </span>
                          }
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Mostrar datos existentes */}
                <Card
                  title="Datos guardados"
                  className="mt-8"
                  extra={
                    <Tag color="blue">
                      {formatEntries
                        ? `Versión ${formatEntries.version}`
                        : "Sin datos"}
                    </Tag>
                  }
                >
                  {formattedDataFromHook && formattedDataFromHook.length > 0 ? (
                    <Table
                      columns={tableColumnsFromHook}
                      dataSource={formattedDataFromHook}
                      scroll={{ x: "max-content", y: 400 }}
                      pagination={{ pageSize: 10 }}
                      style={{ width: "100%", overflowX: "auto" }}
                      size="small"
                    />
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No hay datos guardados para este formato"
                    />
                  )}
                </Card>

                {/* Botón de enviar para revisión destacado */}
                {formatEntries &&
                  formatStatus === "asignado" &&
                  !isEditingDisabled && (
                    <Card className="mt-8 mb-4 bg-gray-50 border-dashed">
                      <div className="text-center">
                        <Title level={5} className="mb-4">
                          ¿Has completado todos los datos?
                        </Title>
                        <Paragraph>
                          Una vez que hayas verificado que todos los datos están
                          correctos, puedes enviar este formato para revisión.
                        </Paragraph>
                        <Button
                          type="primary"
                          danger
                          size="large"
                          icon={<CheckCircleOutlined />}
                          onClick={() => setSubmitModalVisible(true)}
                          className="mt-2"
                          style={{
                            padding: "0 40px",
                            height: "50px",
                            fontSize: "16px",
                          }}
                        >
                          Enviar para revisión
                        </Button>
                      </div>
                    </Card>
                  )}
              </Space>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de confirmación para enviar */}
      <Modal
        title="Confirmar envío"
        open={submitModalVisible}
        onOk={handleSubmitFormat}
        onCancel={() => setSubmitModalVisible(false)}
        okText="Sí, enviar"
        cancelText="Cancelar"
      >
        <div className="py-2">
          <Alert
            message="Esta acción no se puede deshacer"
            description="Una vez enviado, no podrás realizar más cambios hasta que el formato sea revisado por el auditor."
            type="warning"
            showIcon
            className="mb-4"
          />
          <p>¿Estás seguro de que deseas enviar este formato para revisión?</p>
        </div>
      </Modal>
    </div>
  );
}
