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
        <div className="mb-6">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
            className="mb-4"
          >
            Volver
          </Button>
          <Title level={2}>
            Asignar Requerimientos - {entity?.name || "Entidad"}
          </Title>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Areas Column */}
          <Card title="Áreas" className="h-full">
            <List
              dataSource={areas || []}
              renderItem={(area) => (
                <List.Item
                  key={area?.id}
                  className={`cursor-pointer hover:bg-gray-50 p-4 rounded-lg ${
                    selectedArea?.id === area?.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => handleAreaSelect(area)}
                >
                  <div className="w-full">
                    <div className="flex justify-between items-center">
                      <Text strong>{area?.area || "Área sin nombre"}</Text>
                      <Tag color="blue">
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
          </Card>

          {/* Requirements Column */}
          <Card
            title={
              <div className="flex justify-between items-center">
                <span>Requerimientos</span>
                <Search
                  placeholder="Buscar requerimientos..."
                  allowClear
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: 250 }}
                />
              </div>
            }
            className="h-full"
          >
            {selectedArea ? (
              <List
                dataSource={filteredRequirements}
                renderItem={(requirement) => (
                  <List.Item key={requirement?.id}>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <Text strong>
                          {requirement?.ref_code || "Sin código"}
                        </Text>
                        {isRequirementAssigned(requirement?.id) && (
                          <Tag color="success">Asignado</Tag>
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
                        {requirement?.required_information || "Sin descripción"}
                      </div>
                      {isRequirementAssigned(requirement?.id) ? (
                        <>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
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
                                return assignment?.auditor?.id ?? undefined;
                              })()}
                              onChange={(auditorForEntityId) =>
                                handleAssignAuditor(
                                  requirement,
                                  auditorForEntityId ?? null
                                )
                              }
                              loading={auditorLoading[requirement.id]}
                              disabled={auditorLoading[requirement.id]}
                              allowClear
                              dropdownStyle={{ minWidth: 300 }}
                              optionLabelProp="label"
                            >
                              {auditorsForEntities
                                .filter((item) => item.entity.id === entityId)
                                .map((item) => (
                                  <Select.Option
                                    key={item.id}
                                    value={item.id}
                                    label={
                                      item.auditor.first_name +
                                      " " +
                                      item.auditor.last_name +
                                      " (" +
                                      item.auditor.email +
                                      ")"
                                    }
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                      }}
                                    >
                                      {item.auditor.photo ? (
                                        <img
                                          src={item.auditor.photo}
                                          alt={item.auditor.first_name}
                                          style={{
                                            width: 28,
                                            height: 28,
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            marginRight: 6,
                                          }}
                                        />
                                      ) : (
                                        <UserOutlined
                                          style={{
                                            fontSize: 22,
                                            color: "#bfbfbf",
                                            marginRight: 6,
                                          }}
                                        />
                                      )}
                                      <span style={{ fontWeight: 500 }}>
                                        {item.auditor.first_name}{" "}
                                        {item.auditor.last_name}
                                      </span>
                                      <span
                                        style={{
                                          color: "#888",
                                          fontSize: 13,
                                          marginLeft: 6,
                                        }}
                                      >
                                        {item.auditor.email}
                                      </span>
                                    </div>
                                  </Select.Option>
                                ))}
                            </Select>
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
                              onClick={() =>
                                handleUnassignRequirement(requirement)
                              }
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
                <Text type="secondary">
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
