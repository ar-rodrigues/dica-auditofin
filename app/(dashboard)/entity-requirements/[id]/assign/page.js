"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useEntities } from "@/hooks/useEntities";
import { useEntitiesRequirements } from "@/hooks/useEntitiesRequirements";
import { useRequirements } from "@/hooks/useRequirements";
import { useEntitiesAreas } from "@/hooks/useEntitiesAreas";
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
} from "antd";
import {
  ArrowLeftOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  CloseOutlined,
  LoadingOutlined,
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
                  <List.Item
                    key={requirement?.id}
                    actions={[
                      isRequirementAssigned(requirement?.id) ? (
                        <Button
                          key="unassign"
                          danger
                          type="default"
                          icon={
                            buttonLoading[requirement?.id] ? (
                              <LoadingOutlined />
                            ) : (
                              <CloseOutlined />
                            )
                          }
                          onClick={() => handleUnassignRequirement(requirement)}
                          loading={buttonLoading[requirement?.id]}
                        >
                          Desasignar
                        </Button>
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
                        >
                          Asignar
                        </Button>
                      ),
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <Space>
                          <Text strong>
                            {requirement?.ref_code || "Sin código"}
                          </Text>
                          {isRequirementAssigned(requirement?.id) && (
                            <Tag color="success">Asignado</Tag>
                          )}
                        </Space>
                      }
                      description={
                        requirement?.required_information || "Sin descripción"
                      }
                    />
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
