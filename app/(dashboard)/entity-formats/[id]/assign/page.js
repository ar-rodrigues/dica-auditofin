"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useEntities } from "@/hooks/useEntities";
import { useEntitiesRequirements } from "@/hooks/useEntitiesRequirements";
import { useRequirements } from "@/hooks/useRequirements";
import { useEntitiesAreas } from "@/hooks/useEntitiesAreas";
import { useAuditorsForEntities } from "@/hooks/useAuditorsForEntities";
import {
  Card,
  List,
  Typography,
  Button,
  Input,
  Space,
  Spin,
  message,
  Divider,
  Tag,
  Select,
  Skeleton,
  Modal,
  DatePicker,
  ConfigProvider,
} from "antd";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  CloseOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useEntitiesFormats } from "@/hooks/useEntitiesFormats";
import { useFormats } from "@/hooks/useFormats";
import { useUsers } from "@/hooks/useUsers";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import esES from "antd/locale/es_ES";
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("America/Mexico_City");

const { Title, Text } = Typography;
const { Search } = Input;

export default function AssignFormatsPage() {
  const params = useParams();
  const router = useRouter();
  const entityId = params.id;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState(null);
  const [entity, setEntity] = useState(null);
  const [areas, setAreas] = useState([]);
  const [formats, setFormats] = useState([]);
  const [assignedFormats, setAssignedFormats] = useState([]);
  const [buttonLoading, setButtonLoading] = useState({});
  const { auditorsForEntities, fetchAuditorsForEntities } =
    useAuditorsForEntities();
  const [entityAuditors, setEntityAuditors] = useState([]);
  const [auditorLoading, setAuditorLoading] = useState({});

  const { getEntityById } = useEntities();
  const {
    entitiesFormats,
    createEntityFormat,
    fetchEntitiesFormats,
    deleteEntityFormat,
    updateEntityFormat,
  } = useEntitiesFormats();
  const { formats: allFormats, fetchFormats } = useFormats();
  const { entitiesAreas, fetchEntitiesAreas, updateEntityArea } =
    useEntitiesAreas();
  const { users, fetchUsers } = useUsers();
  const [areaUsers, setAreaUsers] = useState({}); // { [areaId]: { predecessor, successor } }
  const [dueDates, setDueDates] = useState({}); // { [formatId]: date }

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("Starting to load data...");

      const [entityData, areasData, formatsData, assignedData, usersData] =
        await Promise.all([
          getEntityById(entityId),
          fetchEntitiesAreas({ entity: entityId }),
          fetchFormats(),
          fetchEntitiesFormats({ entity: entityId }),
          fetchUsers({ entity: entityId }),
        ]);

      setEntity(entityData || null);
      setAreas(Array.isArray(areasData) ? areasData : []);
      setFormats(Array.isArray(formatsData) ? formatsData : []);
      setAssignedFormats(Array.isArray(assignedData) ? assignedData : []);
    } catch (err) {
      console.error("Error loading data:", err);
      message.error("Error al cargar los datos");
      // Set empty arrays as fallback
      setAreas([]);
      setFormats([]);
      setAssignedFormats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!entityId) {
      router.push("/entity-formats");
      return;
    }

    loadData();
  }, [entityId]);

  // Fetch auditors for the current entity
  useEffect(() => {
    const fetchAuditors = async () => {
      if (!entityId) return;
      const data = await fetchAuditorsForEntities({ entity: entityId });
      const auditors = (data || []).map((item) => item.auditor);
      // Only update if auditors actually changed
      setEntityAuditors((prev) => {
        const prevIds = prev.map((a) => a.id).join(",");
        const newIds = auditors.map((a) => a.id).join(",");
        if (prevIds === newIds) return prev;
        return auditors;
      });
    };
    fetchAuditors();
    // Only run on entityId change
  }, [entityId]);

  const handleGoBack = () => {
    router.push(`/entity-formats/${entityId}`);
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    setAreaUsers((prev) => ({
      ...prev,
      [area.id]: {
        predecessor: area.predecessor.id,
        successor: area.successor.id,
      },
    }));
  };

  // Area predecessor/successor state handlers
  const handleSetPredecessor = async (areaId, userId) => {
    setAreaUsers((prev) => ({
      ...prev,
      [areaId]: {
        ...prev[areaId],
        predecessor: userId,
      },
    }));
    try {
      await updateEntityArea(areaId, { predecessor: userId });
      message.success("Predecesor actualizado correctamente");
      fetchEntitiesAreas({ entity: entityId }); // Refresh areas
    } catch (err) {
      message.error("Error al actualizar el predecesor");
    }
  };
  const handleSetSuccessor = async (areaId, userId) => {
    setAreaUsers((prev) => ({
      ...prev,
      [areaId]: {
        ...prev[areaId],
        successor: userId,
      },
    }));
    try {
      await updateEntityArea(areaId, { successor: userId });
      message.success("Sucesor actualizado correctamente");
      fetchEntitiesAreas({ entity: entityId }); // Refresh areas
    } catch (err) {
      message.error("Error al actualizar el sucesor");
    }
  };

  // Due date state handler
  const handleSetDueDate = (formatId, date) => {
    setDueDates((prev) => ({ ...prev, [formatId]: date }));
  };

  // Assignment logic
  const handleAssignFormat = async (format) => {
    if (!selectedArea) {
      message.warning("Por favor seleccione un área primero");
      return;
    }
    setButtonLoading((prev) => ({ ...prev, [format.id]: true }));
    try {
      const result = await createEntityFormat({
        entity: entityId,
        format: format.id,
        area: selectedArea.id,
        is_active: true,
        due_date: dueDates[format.id] || null,
      });
      if (result.success) {
        message.success("Formato asignado exitosamente");
        const updatedAssigned = await fetchEntitiesFormats({
          entity: entityId,
        });
        setAssignedFormats(updatedAssigned);
      } else {
        message.error("Error al asignar el formato");
      }
    } catch (err) {
      console.error("Error assigning format:", err);
      message.error("Error al asignar el formato");
    } finally {
      setButtonLoading((prev) => ({ ...prev, [format.id]: false }));
    }
  };

  const handleUnassignFormat = async (format) => {
    if (!selectedArea) return;
    const assignment = assignedFormats.find(
      (f) => f.format.id === format.id && f.area.id === selectedArea.id
    );
    if (!assignment) return;
    setButtonLoading((prev) => ({ ...prev, [format.id]: true }));
    try {
      const result = await deleteEntityFormat(assignment.id);
      if (result.success) {
        message.success("Formato desasignado exitosamente");
        const updatedAssigned = await fetchEntitiesFormats({
          entity: entityId,
        });
        setAssignedFormats(updatedAssigned);
      } else {
        message.error("Error al desasignar el formato");
      }
    } catch (err) {
      console.error("Error unassigning format:", err);
      message.error("Error al desasignar el formato");
    } finally {
      setButtonLoading((prev) => ({ ...prev, [format.id]: false }));
    }
  };

  const isFormatAssigned = (formatId) => {
    if (!assignedFormats || !selectedArea) return false;
    return assignedFormats.some(
      (f) => f?.format?.id === formatId && f?.area?.id === selectedArea?.id
    );
  };

  const getAssignedFormatsForArea = (areaId) => {
    if (!assignedFormats) return [];
    return assignedFormats.filter((f) => f?.area?.id === areaId) || [];
  };

  const filteredFormats = Array.isArray(formats)
    ? formats.filter((format) => {
        if (!format) return false;
        const matchesSearch =
          !searchTerm ||
          (format.name || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (format.description || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesSearch;
      })
    : [];

  // Auditor and due date assignment per format
  const handleAssignAuditor = async (format, auditorId) => {
    const assignment = assignedFormats.find(
      (f) => f.format.id === format.id && f.area.id === selectedArea.id
    );
    if (!assignment) return;
    setAuditorLoading((prev) => ({ ...prev, [format.id]: true }));
    try {
      const response = await updateEntityFormat(assignment.id, {
        auditor: auditorId,
      });
      if (response.success) {
        message.success("Auditor asignado exitosamente");
        const updatedAssigned = await fetchEntitiesFormats({
          entity: entityId,
        });
        setAssignedFormats(updatedAssigned);
      } else {
        message.error("Error al asignar el auditor");
      }
    } catch (err) {
      message.error("Error al asignar el auditor");
    } finally {
      setAuditorLoading((prev) => ({ ...prev, [format.id]: false }));
    }
  };

  const highlightText = (text, search) => {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, "gi");
    return (
      <span>
        {text.split(regex).map((part, i) =>
          regex.test(part) ? (
            <span key={i} style={{ background: "#ffe58f", fontWeight: 600 }}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex justify-center items-center py-20 bg-white rounded-lg shadow-sm">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6">
        <div className="mb-8">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            className="mb-4"
          >
            Volver
          </Button>
          <Title level={1} style={{ fontWeight: 800, fontSize: 32 }}>
            Asignar Formatos - {entity?.name || "Entidad"}
          </Title>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Areas Column */}
          <Card
            title={<span style={{ fontWeight: 700, fontSize: 22 }}>Áreas</span>}
            className="h-full"
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : areas.length === 0 ? (
              <div className="flex flex-col  gap-4">
                <Text type="secondary" style={{ fontSize: 17 }}>
                  No hay áreas disponibles, por favor asigne áreas a la entidad.
                </Text>
                <Button
                  type="primary"
                  onClick={() => router.push(`/entities/edit/${entityId}`)}
                >
                  Editar Entidad
                </Button>
              </div>
            ) : (
              areas.length > 0 && (
                <List
                  dataSource={areas || []}
                  renderItem={(area) => (
                    <List.Item
                      key={area?.id}
                      className={`cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-all duration-200 ${
                        selectedArea?.id === area?.id
                          ? "bg-blue-50 border-2 border-blue-400"
                          : "border border-transparent"
                      }`}
                      style={{ marginBottom: 10 }}
                      onClick={() => handleAreaSelect(area)}
                    >
                      <div className="w-full">
                        <div className="flex justify-between items-center">
                          <Text strong style={{ fontSize: 18 }}>
                            {area?.area || "Área sin nombre"}
                          </Text>
                          <Tag color="blue" style={{ fontSize: 15 }}>
                            {getAssignedFormatsForArea(area?.id).length}{" "}
                            formatos
                          </Tag>
                        </div>
                        {selectedArea?.id === area?.id && (
                          <div className="mt-2">
                            <Text type="secondary">
                              {getAssignedFormatsForArea(area?.id).map((f) => (
                                <Tag key={f?.id} className="mr-1 mb-1">
                                  {f?.format?.name || "Sin nombre"}
                                </Tag>
                              ))}
                            </Text>
                          </div>
                        )}
                      </div>
                    </List.Item>
                  )}
                />
              )
            )}
          </Card>
          {/* Formats Column */}
          <Card
            title={
              <div className="flex flex-col gap-2">
                <span style={{ fontWeight: 700, fontSize: 22 }}>
                  Listado de Formatos
                </span>
                <span style={{ fontSize: 14, color: "#666" }}>
                  Disponibles para asignación
                </span>
              </div>
            }
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => router.push("/formats/create")}
              />
            }
            className="h-full"
          >
            <div className="mb-4 flex justify-end">
              <Search
                placeholder="Buscar formatos..."
                allowClear
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
            {selectedArea && (
              <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Predecessor:</span>
                  <ConfigProvider locale={esES}>
                    <Select
                      style={{ width: "100%", minWidth: 220 }}
                      placeholder="Seleccionar predecesor"
                      value={areaUsers[selectedArea.id]?.predecessor}
                      onChange={(userId) =>
                        handleSetPredecessor(selectedArea.id, userId)
                      }
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      dropdownStyle={{
                        maxHeight: 250,
                        overflowY: "auto",
                        paddingBottom: 16,
                      }}
                      optionLabelProp="label"
                    >
                      {users.map((user) => (
                        <Select.Option
                          key={user.id}
                          value={user.id}
                          label={
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                lineHeight: 1.2,
                              }}
                            >
                              <span style={{ fontWeight: 500 }}>
                                {user.first_name} {user.last_name}
                              </span>
                              <span style={{ color: "#888", fontSize: 13 }}>
                                {user.email}
                              </span>
                            </div>
                          }
                          style={{ padding: "8px 12px", marginBottom: 2 }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              lineHeight: 1.2,
                            }}
                          >
                            <span style={{ fontWeight: 500 }}>
                              {user.first_name} {user.last_name}
                            </span>
                            <span style={{ color: "#888", fontSize: 13 }}>
                              {user.email}
                            </span>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </ConfigProvider>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="font-medium">Successor:</span>
                  <ConfigProvider locale={esES}>
                    <Select
                      style={{ width: "100%", minWidth: 220 }}
                      placeholder="Seleccionar sucesor"
                      value={areaUsers[selectedArea.id]?.successor}
                      onChange={(userId) =>
                        handleSetSuccessor(selectedArea.id, userId)
                      }
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      dropdownStyle={{
                        maxHeight: 250,
                        overflowY: "auto",
                        paddingBottom: 16,
                      }}
                      optionLabelProp="label"
                    >
                      {users.map((user) => (
                        <Select.Option
                          key={user.id}
                          value={user.id}
                          label={
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                lineHeight: 1.2,
                              }}
                            >
                              <span style={{ fontWeight: 500 }}>
                                {user.first_name} {user.last_name}
                              </span>
                              <span style={{ color: "#888", fontSize: 13 }}>
                                {user.email}
                              </span>
                            </div>
                          }
                          style={{ padding: "8px 12px", marginBottom: 2 }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              lineHeight: 1.2,
                            }}
                          >
                            <span style={{ fontWeight: 500 }}>
                              {user.first_name} {user.last_name}
                            </span>
                            <span style={{ color: "#888", fontSize: 13 }}>
                              {user.email}
                            </span>
                          </div>
                        </Select.Option>
                      ))}
                    </Select>
                  </ConfigProvider>
                </div>
              </div>
            )}
            {loading ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : selectedArea ? (
              <List
                dataSource={filteredFormats}
                renderItem={(format) => (
                  <List.Item key={format?.id} style={{ marginBottom: 18 }}>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        padding: 8,
                        borderRadius: 8,
                        background: isFormatAssigned(format?.id)
                          ? "#f6ffed"
                          : "#fff",
                        border: isFormatAssigned(format?.id)
                          ? "1.5px solid #b7eb8f"
                          : "1px solid #f0f0f0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <Text strong style={{ fontSize: 17 }}>
                            {highlightText(
                              format?.name || "Sin nombre",
                              searchTerm
                            )}
                          </Text>
                          {isFormatAssigned(format?.id) && (
                            <Tag
                              color="success"
                              style={{ fontSize: 15, marginLeft: 8 }}
                            >
                              Asignado
                            </Tag>
                          )}
                        </div>
                        {isFormatAssigned(format?.id) && (
                          <Button
                            key="unassign"
                            danger
                            icon={
                              buttonLoading[format?.id] ? (
                                <LoadingOutlined />
                              ) : (
                                <CloseOutlined />
                              )
                            }
                            onClick={() => {
                              Modal.confirm({
                                title: "¿Desasignar formato?",
                                content:
                                  "¿Está seguro que desea desasignar este formato?",
                                okText: "Sí, desasignar",
                                okType: "danger",
                                cancelText: "Cancelar",
                                onOk: () => handleUnassignFormat(format),
                              });
                            }}
                            loading={buttonLoading[format?.id]}
                            style={{ minWidth: 110 }}
                          >
                            Desasignar
                          </Button>
                        )}
                      </div>
                      <div
                        style={{
                          margin: "4px 0 8px 0",
                          color: "#555",
                          fontSize: 15,
                          maxWidth: 600,
                        }}
                      >
                        {highlightText(
                          format?.description || "Sin descripción",
                          searchTerm
                        )}
                      </div>
                      {isFormatAssigned(format?.id) ? (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 16,
                              marginTop: 4,
                            }}
                          >
                            <div className="flex flex-col gap-2">
                              <span className="font-medium flex items-center">
                                <UserOutlined
                                  style={{ color: "#1890ff", marginRight: 4 }}
                                />
                                Auditor:
                              </span>
                              {entityAuditors.length > 0 ? (
                                <Select
                                  key="auditor-select"
                                  style={{
                                    width: "100%",
                                    minWidth: 220,
                                    maxWidth: "100%",
                                  }}
                                  placeholder="Seleccionar auditor"
                                  showSearch
                                  optionFilterProp="children"
                                  value={(() => {
                                    const assignment = assignedFormats.find(
                                      (f) =>
                                        f.format.id === format.id &&
                                        f.area.id === selectedArea.id
                                    );
                                    if (!assignment?.auditor) return undefined;
                                    return assignment.auditor.id;
                                  })()}
                                  onChange={(auditorId) =>
                                    handleAssignAuditor(
                                      format,
                                      auditorId ?? null
                                    )
                                  }
                                  loading={auditorLoading[format.id]}
                                  disabled={auditorLoading[format.id]}
                                  allowClear
                                  dropdownStyle={{
                                    minWidth: 300,
                                    maxHeight: 250,
                                    overflowY: "auto",
                                  }}
                                  optionLabelProp="children"
                                >
                                  {auditorsForEntities
                                    .filter(
                                      (item) => item.entity.id === entityId
                                    )
                                    .map((item) => (
                                      <Select.Option
                                        key={item.id}
                                        value={item.id}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            lineHeight: 1.2,
                                          }}
                                        >
                                          <span style={{ fontWeight: 500 }}>
                                            {item.auditor.first_name}{" "}
                                            {item.auditor.last_name}
                                          </span>
                                          <span
                                            style={{
                                              color: "#888",
                                              fontSize: 13,
                                            }}
                                          >
                                            {item.auditor.email}
                                          </span>
                                        </div>
                                      </Select.Option>
                                    ))}
                                </Select>
                              ) : (
                                <>
                                  <Text
                                    type="secondary"
                                    style={{ fontSize: 15 }}
                                  >
                                    No hay auditores asignados
                                  </Text>
                                  <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() =>
                                      router.push(`/entities/edit/${entityId}`)
                                    }
                                  >
                                    Asignar
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                          <div
                            style={{ marginTop: 8 }}
                            className="flex flex-col gap-2"
                          >
                            <span className="font-medium">
                              Fecha de vencimiento:
                            </span>
                            <ConfigProvider locale={esES}>
                              <DatePicker
                                value={(() => {
                                  const assignment = assignedFormats.find(
                                    (f) =>
                                      f.format.id === format.id &&
                                      f.area.id === selectedArea.id
                                  );
                                  return assignment?.due_date
                                    ? dayjs.tz(
                                        assignment.due_date,
                                        "America/Mexico_City"
                                      )
                                    : undefined;
                                })()}
                                onChange={async (date) => {
                                  handleSetDueDate(
                                    format.id,
                                    date
                                      ? date
                                          .tz("America/Mexico_City")
                                          .toISOString()
                                      : null
                                  );
                                  const assignment = assignedFormats.find(
                                    (f) =>
                                      f.format.id === format.id &&
                                      f.area.id === selectedArea.id
                                  );
                                  if (assignment) {
                                    // Update due_date if already assigned
                                    setButtonLoading((prev) => ({
                                      ...prev,
                                      [format.id]: true,
                                    }));
                                    try {
                                      const response = await updateEntityFormat(
                                        assignment.id,
                                        {
                                          due_date: date
                                            ? date
                                                .tz("America/Mexico_City")
                                                .toISOString()
                                            : null,
                                        }
                                      );
                                      if (response.success) {
                                        message.success(
                                          "Fecha de vencimiento actualizada exitosamente"
                                        );
                                        const updatedAssigned =
                                          await fetchEntitiesFormats({
                                            entity: entityId,
                                          });
                                        setAssignedFormats(updatedAssigned);
                                      } else {
                                        message.error(
                                          "Error al actualizar la fecha de vencimiento"
                                        );
                                      }
                                    } catch (err) {
                                      message.error(
                                        "Error al actualizar la fecha de vencimiento"
                                      );
                                    } finally {
                                      setButtonLoading((prev) => ({
                                        ...prev,
                                        [format.id]: false,
                                      }));
                                    }
                                  } else {
                                    // If not assigned, assign with due_date
                                    handleAssignFormat(format);
                                  }
                                }}
                                format="DD/MM/YYYY"
                                style={{ minWidth: 150 }}
                                allowClear
                              />
                            </ConfigProvider>
                          </div>
                        </>
                      ) : (
                        <Button
                          key="assign"
                          type="primary"
                          icon={
                            buttonLoading[format?.id] ? (
                              <LoadingOutlined />
                            ) : (
                              <PlusOutlined />
                            )
                          }
                          onClick={() => handleAssignFormat(format)}
                          loading={buttonLoading[format?.id]}
                          style={{ marginTop: 8, minWidth: 110 }}
                        >
                          Asignar
                        </Button>
                      )}
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <div className="text-center py-8">
                <Text type="secondary" style={{ fontSize: 17 }}>
                  Seleccione un área para ver y asignar formatos
                </Text>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
