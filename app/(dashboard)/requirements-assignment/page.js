"use client";

import { useState, useEffect } from "react";
import {
  Typography,
  Select,
  Card,
  Collapse,
  Button,
  Space,
  Steps,
  Modal,
} from "antd";
import { useAtomValue } from "jotai";
import { mockRequirementsAtom } from "@/utils/atoms";
import RequirementsAssignmentPanel from "@/components/RequirementsAssignmentPanel";
import { useRouter } from "next/navigation";
import { CheckOutlined, ExclamationCircleFilled } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

// Mock data for areas - this would come from your backend later
const mockAreas = [
  { id: 1, name: "Educación" },
  { id: 2, name: "Salud" },
  { id: 3, name: "Finanzas" },
  { id: 4, name: "Obras Públicas" },
  { id: 5, name: "Recursos Humanos" },
];

// Mock assigned requirements data - replace with your actual data
const mockAssignedRequirements = {
  1: [
    {
      id: 1,
      ref_code: "REQ-001",
      info: "Relación de actas de Sesión de Cabildo",
      area: "Educación",
      areaId: 1,
      status: "active",
    },
    {
      id: 2,
      ref_code: "REQ-002",
      info: "Estados financieros mensuales",
      area: "Educación",
      areaId: 1,
      status: "active",
    },
    {
      id: 3,
      ref_code: "REQ-003",
      info: "Presupuesto anual",
      area: "Finanzas",
      areaId: 3,
      status: "active",
    },
  ],
};

export default function RequirementsAssignmentPage() {
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [areaAssignments, setAreaAssignments] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const requirements = useAtomValue(mockRequirementsAtom);
  const router = useRouter();

  // Get entity from URL and check if in edit mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const entityId = params.get("entity");
    const isEdit = params.get("edit") === "true";

    if (entityId) {
      const numericId = Number(entityId);
      setSelectedEntity(numericId);
      setIsEditMode(isEdit);

      // If in edit mode, populate the assignments
      if (isEdit && mockAssignedRequirements[numericId]) {
        const currentRequirements = mockAssignedRequirements[numericId];
        // Group requirements by area
        const groupedRequirements = currentRequirements.reduce((acc, req) => {
          if (!acc[req.areaId]) {
            acc[req.areaId] = [];
          }
          acc[req.areaId].push(req);
          return acc;
        }, {});
        setAreaAssignments(groupedRequirements);
      }
      setCurrentStep(1);
    }
  }, []);

  // Mock entities data - replace with your actual entities data
  const entities = [
    { id: 1, name: "Municipio de Puebla" },
    { id: 2, name: "Organismo Operador del Servicio de Limpia" },
  ];

  const handleSaveAssignments = () => {
    // Here you would implement the logic to save the assignments
    console.log("Saving assignments:", areaAssignments);

    // Redirect to entity requirements page
    router.push("/entity-requirements");
  };

  const handleAssignmentsChange = (areaId, newAssignments) => {
    setAreaAssignments((prev) => ({
      ...prev,
      [areaId]: newAssignments,
    }));
  };

  const showConfirmReset = () => {
    confirm({
      title: "¿Estás seguro de volver al paso anterior?",
      icon: <ExclamationCircleFilled />,
      content: "Se perderán todas las asignaciones realizadas.",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk() {
        setCurrentStep(0);
        setAreaAssignments({});
        setSelectedEntity(null);
      },
    });
  };

  const steps = [
    {
      title: "Seleccionar Entidad",
      content: (
        <Card styles={{ body: { padding: "24px" } }} className="mb-4">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Seleccionar Entidad
              </label>
              <Select
                placeholder="Seleccione una entidad"
                style={{ width: "100%" }}
                onChange={(value) => {
                  setSelectedEntity(value);
                  setCurrentStep(1);
                }}
                value={selectedEntity}
                disabled={isEditMode}
              >
                {entities.map((entity) => (
                  <Option key={entity.id} value={entity.id}>
                    {entity.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </Card>
      ),
    },
    {
      title: "Asignar Requerimientos",
      content: (
        <>
          <div className="mb-4">
            <Collapse
              items={mockAreas.map((area) => ({
                key: area.id,
                label: area.name,
                children: (
                  <RequirementsAssignmentPanel
                    availableRequirements={requirements}
                    selectedRequirements={areaAssignments[area.id] || []}
                    onAssignmentsChange={(newAssignments) =>
                      handleAssignmentsChange(area.id, newAssignments)
                    }
                  />
                ),
              }))}
            />
          </div>
          <div className="flex justify-between">
            <Button onClick={showConfirmReset}>
              Volver a Selección de Entidad
            </Button>
            <Button
              type="primary"
              onClick={() => setCurrentStep(2)}
              disabled={Object.keys(areaAssignments).length === 0}
            >
              Revisar Asignaciones
            </Button>
          </div>
        </>
      ),
    },
    {
      title: "Revisar y Confirmar",
      content: (
        <div className="space-y-4">
          <Card styles={{ body: { padding: "24px" } }} className="mb-4">
            <Title level={5}>Resumen de Asignaciones</Title>
            <div className="space-y-6">
              {mockAreas.map((area) => {
                const areaRequirements = areaAssignments[area.id] || [];
                if (areaRequirements.length === 0) return null;

                return (
                  <div key={area.id} className="border-b pb-4 last:border-b-0">
                    <Title level={5} className="text-primary mb-2">
                      {area.name}
                    </Title>
                    <ul className="list-disc pl-6">
                      {areaRequirements.map((req) => (
                        <li key={req.id} className="text-gray-600">
                          {req.ref_code} - {req.info}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </Card>
          <div className="flex justify-between">
            <Button onClick={() => setCurrentStep(1)}>
              Volver a Asignaciones
            </Button>
            <Button type="primary" onClick={handleSaveAssignments}>
              {isEditMode ? "Guardar Cambios" : "Confirmar y Guardar"}
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto flex flex-col">
        <Title level={5} className="text-gray-600! mb-4">
          {isEditMode
            ? "Editar Requerimientos"
            : "Asignación de Requerimientos"}
        </Title>

        <Steps
          current={currentStep}
          items={steps.map((item) => ({ title: item.title }))}
          className="mb-8"
        />

        {steps[currentStep].content}
      </div>
    </div>
  );
}
