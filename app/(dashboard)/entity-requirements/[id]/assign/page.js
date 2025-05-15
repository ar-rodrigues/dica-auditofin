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

const { Title, Text } = Typography;
const { Search } = Input;

export default function AssignRequirementsPage() {
  const params = useParams();
  const router = useRouter();
  const entityId = params.id;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedArea, setSelectedArea] = useState(null);
  const [entity, setEntity] = useState(null);
  const [areas, setAreas] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [assignedRequirements, setAssignedRequirements] = useState([]);
  const [buttonLoading, setButtonLoading] = useState({});
  const { auditorsForEntities, fetchAuditorsForEntities } =
    useAuditorsForEntities();
  const [entityAuditors, setEntityAuditors] = useState([]);
  const [auditorLoading, setAuditorLoading] = useState({});

  const { getEntityById } = useEntities();
  const {
    entitiesRequirements,
    createEntityRequirement,
    fetchEntitiesRequirements,
    deleteEntityRequirement,
  } = useEntitiesRequirements();
  const { requirements: allRequirements, fetchRequirements } =
    useRequirements();
  const { entitiesAreas, fetchEntitiesAreas } = useEntitiesAreas();

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("Starting to load data...");

      const [entityData, areasData, requirementsData, assignedData] =
        await Promise.all([
          getEntityById(entityId),
          fetchEntitiesAreas({ entity: entityId }),
          fetchRequirements(),
          fetchEntitiesRequirements({ entity: entityId }),
        ]);

      console.log("Data loaded:", {
        entityData,
        areasData,
        requirementsData,
        assignedData,
      });

      setEntity(entityData || null);
      setAreas(Array.isArray(areasData) ? areasData : []);
      setRequirements(Array.isArray(requirementsData) ? requirementsData : []);
      setAssignedRequirements(Array.isArray(assignedData) ? assignedData : []);

      console.log("State updated:", {
        entity: entityData || null,
        areas: Array.isArray(areasData) ? areasData : [],
        requirements: Array.isArray(requirementsData) ? requirementsData : [],
        assignedRequirements: Array.isArray(assignedData) ? assignedData : [],
      });
    } catch (err) {
      console.error("Error loading data:", err);
      message.error("Error al cargar los datos");
      // Set empty arrays as fallback
      setAreas([]);
      setRequirements([]);
      setAssignedRequirements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!entityId) {
      router.push("/entity-requirements");
      return;
    }

    loadData();
  }, [entityId]);

  // Add effect to log state changes
  useEffect(() => {
    console.log("State changed:", {
      entity,
      areas,
      requirements,
      assignedRequirements,
    });
  }, [entity, areas, requirements, assignedRequirements]);

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

  console.log("areas", areas);
  //   console.log("requirements", requirements);
  //   console.log("assignedRequirements", assignedRequirements);
  console.log("entity id", entityId);

  const handleGoBack = () => {
    router.push(`/entity-requirements/${entityId}`);
  };

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
  };

  const handleAssignRequirement = async (requirement) => {
    if (!selectedArea) {
      message.warning("Por favor seleccione un área primero");
      return;
    }
    setButtonLoading((prev) => ({ ...prev, [requirement.id]: true }));
    try {
      const result = await createEntityRequirement({
        entity: entityId,
        requirement: requirement.id,
        area: selectedArea.id,
        is_active: true,
      });
      if (result.success) {
        message.success("Requerimiento asignado exitosamente");
        const updatedAssigned = await fetchEntitiesRequirements({
          entity: entityId,
        });
        setAssignedRequirements(updatedAssigned);
      } else {
        message.error("Error al asignar el requerimiento");
      }
    } catch (err) {
      console.error("Error assigning requirement:", err);
      message.error("Error al asignar el requerimiento");
    } finally {
      setButtonLoading((prev) => ({ ...prev, [requirement.id]: false }));
    }
  };

  const handleUnassignRequirement = async (requirement) => {
    if (!selectedArea) return;
    // Find the assignment id
    const assignment = assignedRequirements.find(
      (req) =>
        req.requirement.id === requirement.id && req.area.id === selectedArea.id
    );
    if (!assignment) return;
    setButtonLoading((prev) => ({ ...prev, [requirement.id]: true }));
    try {
      const result = await deleteEntityRequirement(assignment.id);
      if (result.success) {
        message.success("Requerimiento desasignado exitosamente");
        const updatedAssigned = await fetchEntitiesRequirements({
          entity: entityId,
        });
        setAssignedRequirements(updatedAssigned);
      } else {
        message.error("Error al desasignar el requerimiento");
      }
    } catch (err) {
      console.error("Error unassigning requirement:", err);
      message.error("Error al desasignar el requerimiento");
    } finally {
      setButtonLoading((prev) => ({ ...prev, [requirement.id]: false }));
    }
  };

  const isRequirementAssigned = (requirementId) => {
    if (!assignedRequirements || !selectedArea) return false;
    return assignedRequirements.some(
      (req) =>
        req?.requirement?.id === requirementId &&
        req?.area?.id === selectedArea?.id
    );
  };

  const getAssignedRequirementsForArea = (areaId) => {
    if (!assignedRequirements) return [];
    return assignedRequirements.filter((req) => req?.area?.id === areaId) || [];
  };

  const filteredRequirements = Array.isArray(requirements)
    ? requirements.filter((requirement) => {
        if (!requirement) return false;
        const matchesSearch =
          !searchTerm ||
          (requirement.required_information || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (requirement.ref_code || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesSearch;
      })
    : [];

  // Handler to assign auditor to a requirement
  const handleAssignAuditor = async (requirement, auditorForEntityId) => {
    const assignment = assignedRequirements.find(
      (req) =>
        req.requirement.id === requirement.id && req.area.id === selectedArea.id
    );
    if (!assignment) return;
    setAuditorLoading((prev) => ({ ...prev, [requirement.id]: true }));
    try {
      // If auditorForEntityId is null, remove auditor
      const response = await fetch(
        `/api/entities-requirements/${assignment.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ auditor: auditorForEntityId }),
        }
      );
      const result = await response.json();
      if (result.success) {
        message.success(
          auditorForEntityId
            ? "Auditor asignado exitosamente"
            : "Auditor removido exitosamente"
        );
        const updatedAssigned = await fetchEntitiesRequirements({
          entity: entityId,
        });
        setAssignedRequirements(updatedAssigned);
      } else {
        message.error(
          auditorForEntityId
            ? "Error al asignar el auditor"
            : "Error al remover el auditor"
        );
      }
    } catch (err) {
      message.error(
        auditorForEntityId
          ? "Error al asignar el auditor"
          : "Error al remover el auditor"
      );
    } finally {
      setAuditorLoading((prev) => ({ ...prev, [requirement.id]: false }));
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
            Asignar Requerimientos - {entity?.name || "Entidad"}
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
                            {getAssignedRequirementsForArea(area?.id).length}{" "}
                            requerimientos
                          </Tag>
                        </div>
                        {selectedArea?.id === area?.id && (
                          <div className="mt-2">
                            <Text type="secondary">
                              {getAssignedRequirementsForArea(area?.id).map(
                                (req) => (
                                  <Tag key={req?.id} className="mr-1 mb-1">
                                    {req?.requirement?.ref_code || "Sin código"}
                                  </Tag>
                                )
                              )}
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
          {/* Requirements Column */}
          <Card
            title={
              <div className="flex flex-col gap-2">
                <span style={{ fontWeight: 700, fontSize: 22 }}>
                  Listado de Requerimientos
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
                onClick={() => router.push("/requirements/create")}
              />
            }
            className="h-full"
          >
            <div className="mb-4 flex justify-end">
              <Search
                placeholder="Buscar requerimientos..."
                allowClear
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
            {loading ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : selectedArea ? (
              <List
                dataSource={filteredRequirements}
                renderItem={(requirement) => (
                  <List.Item key={requirement?.id} style={{ marginBottom: 18 }}>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        padding: 8,
                        borderRadius: 8,
                        background: isRequirementAssigned(requirement?.id)
                          ? "#f6ffed"
                          : "#fff",
                        border: isRequirementAssigned(requirement?.id)
                          ? "1.5px solid #b7eb8f"
                          : "1px solid #f0f0f0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          flexWrap: "wrap",
                        }}
                      >
                        <Text strong style={{ fontSize: 17 }}>
                          {highlightText(
                            requirement?.ref_code || "Sin código",
                            searchTerm
                          )}
                        </Text>
                        {isRequirementAssigned(requirement?.id) && (
                          <Tag color="success" style={{ fontSize: 15 }}>
                            Asignado
                          </Tag>
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
                          requirement?.required_information ||
                            "Sin descripción",
                          searchTerm
                        )}
                      </div>
                      {isRequirementAssigned(requirement?.id) ? (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 16,
                              marginTop: 4,
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 500,
                                marginRight: 6,
                                minWidth: 70,
                              }}
                            >
                              <UserOutlined
                                style={{ color: "#1890ff", marginRight: 4 }}
                              />{" "}
                              Auditor:
                            </span>
                            {entityAuditors.length > 0 ? (
                              <Select
                                key="auditor-select"
                                style={{
                                  minWidth: 220,
                                  maxWidth: 320,
                                  marginRight: 12,
                                }}
                                placeholder="Seleccionar auditor"
                                showSearch
                                optionFilterProp="children"
                                value={(() => {
                                  const assignment = assignedRequirements.find(
                                    (req) =>
                                      req.requirement.id === requirement.id &&
                                      req.area.id === selectedArea.id
                                  );
                                  if (!assignment?.auditor) return undefined;
                                  return assignment.auditor.id;
                                })()}
                                onChange={(auditorId) =>
                                  handleAssignAuditor(
                                    requirement,
                                    auditorId ?? null
                                  )
                                }
                                loading={auditorLoading[requirement.id]}
                                disabled={auditorLoading[requirement.id]}
                                allowClear
                                dropdownStyle={{ minWidth: 300 }}
                                optionLabelProp="children"
                              >
                                {auditorsForEntities
                                  .filter((item) => item.entity.id === entityId)
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
                                <Text type="secondary" style={{ fontSize: 15 }}>
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
                          <div style={{ marginTop: 8 }}>
                            <Button
                              key="unassign"
                              danger
                              icon={
                                buttonLoading[requirement?.id] ? (
                                  <LoadingOutlined />
                                ) : (
                                  <CloseOutlined />
                                )
                              }
                              onClick={() => {
                                Modal.confirm({
                                  title: "¿Desasignar requerimiento?",
                                  content:
                                    "¿Está seguro que desea desasignar este requerimiento?",
                                  okText: "Sí, desasignar",
                                  okType: "danger",
                                  cancelText: "Cancelar",
                                  onOk: () =>
                                    handleUnassignRequirement(requirement),
                                });
                              }}
                              loading={buttonLoading[requirement?.id]}
                              style={{ minWidth: 110 }}
                            >
                              Desasignar
                            </Button>
                          </div>
                        </>
                      ) : (
                        <Button
                          key="assign"
                          type="primary"
                          icon={
                            buttonLoading[requirement?.id] ? (
                              <LoadingOutlined />
                            ) : (
                              <PlusOutlined />
                            )
                          }
                          onClick={() => handleAssignRequirement(requirement)}
                          loading={buttonLoading[requirement?.id]}
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
                  Seleccione un área para ver y asignar requerimientos
                </Text>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
