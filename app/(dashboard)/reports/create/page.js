"use client";

import { useState } from "react";
import { Form, Button, Card, Steps, Typography, message, Spin } from "antd";
import { useRouter } from "next/navigation";
import { UserOutlined, TeamOutlined, BankOutlined } from "@ant-design/icons";
import ReportForm from "@/components/Reports/ReportForm";
import PermissionCard from "@/components/Reports/PermissionCard";
import PermissionModal from "@/components/Reports/PermissionModal";
import { useRoles } from "@/hooks/useRoles";
import { useEntities } from "@/hooks/useEntities";
import { useUsers } from "@/hooks/useUsers";
import { useReports } from "@/hooks/useReports";
import { usePermissions } from "@/hooks/usePermissions";

const { Text, Title } = Typography;

export default function CreateReportPage() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectedPermissionType, setSelectedPermissionType] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState({
    users: [],
    roles: [],
    entities: [],
  });
  const router = useRouter();
  const { roles } = useRoles();
  const { entities } = useEntities();
  const { users } = useUsers();
  const { reports, loading, error, fetchReports, createReport, deleteReport } =
    useReports();
  const {
    loading: permissionsLoading,
    error: permissionsError,
    createPermission,
  } = usePermissions();

  const getFilteredData = (type, searchQuery) => {
    const data = type === "users" ? users : type === "roles" ? roles : entities;

    if (!searchQuery) return data;

    return data.filter((item) => {
      if (type === "users") {
        return (
          (item.first_name + " " + item.last_name)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
      } else if (type === "roles") {
        return item.role.toLowerCase().includes(searchQuery.toLowerCase());
      } else {
        return item.entity_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      }
    });
  };

  const getColumns = (type) => {
    const baseColumns = [
      {
        title: "Nombre",
        key: "name",
        render: (_, record) => {
          if (type === "users") {
            return `${record.first_name} ${record.last_name}`;
          } else if (type === "roles") {
            return record.role?.toUpperCase();
          } else {
            return record.entity_name?.toUpperCase();
          }
        },
      },
    ];

    if (type === "users") {
      baseColumns.push({
        title: "Email",
        key: "email",
        render: (_, record) => record.email,
      });
    }

    baseColumns.push({
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Button
          onClick={() => handlePermissionSelection(type, record.id)}
          type={
            selectedPermissions[type]?.includes(record.id)
              ? "primary"
              : "default"
          }
        >
          {selectedPermissions[type]?.includes(record.id)
            ? "Seleccionado"
            : "Seleccionar"}
        </Button>
      ),
    });

    return baseColumns;
  };

  const handlePermissionSelection = (type, id) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [type]: prev[type].includes(id)
        ? prev[type].filter((item) => item !== id)
        : [...prev[type], id],
    }));
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleCreateReport = async () => {
    setIsSubmitting(true);
    try {
      // Create the report first
      const reportResult = await createReport(formData);

      if (!reportResult) {
        message.error("Error al crear el reporte");
        return;
      }

      // Then try to create permissions
      try {
        const permissionData = {
          table_asset: "reports",
          asset_id: reportResult.id,
          ...selectedPermissions,
        };
        const permissionResult = await createPermission(permissionData);

        if (!permissionResult) {
          // If permissions fail, we should clean up by deleting the report
          await deleteReport(reportResult.id);
          message.error("Error al crear los permisos");
          return;
        }

        // Success path - both report and permissions created
        message.success("Reporte creado exitosamente");
        router.push("/reports");
      } catch (permError) {
        // If permissions throw an error, clean up the report
        await deleteReport(reportResult.id);
        console.error("Error creating permissions:", permError);
        message.error("Error al crear los permisos: " + permError.message);
      }
    } catch (error) {
      console.error("Error creating report:", error);
      message.error("Error al crear el reporte: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFinish = async (values) => {
    setIsSubmitting(true);
    try {
      const reportResult = await createReport(formData);
      const permissionResult = await createPermission(selectedPermissions);

      if (reportResult && permissionResult) {
        message.success("Reporte creado exitosamente");
        router.push("/reports");
      } else {
        message.error("Error al crear el reporte o los permisos");
      }
    } catch (error) {
      console.error("Error creating report:", error);
      message.error("Error al crear el reporte: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.error("Form validation failed:", errorInfo);
    message.error("Error al validar el formulario");
  };

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        // Validate and store form values when moving to next step
        const values = await form.validateFields();
        setFormData(values);
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("Error in form validation:", error);
    }
  };

  const permissionCards = [
    {
      type: "users",
      icon: <UserOutlined className="text-4xl !text-blue-500" />,
      label: "Permisos de Usuario",
      selectedCount: selectedPermissions.users.length,
      data: users,
    },
    {
      type: "roles",
      icon: <TeamOutlined className="text-4xl !text-blue-500" />,
      label: "Permisos de Rol",
      selectedCount: selectedPermissions.roles.length,
      data: roles,
    },
    {
      type: "entities",
      icon: <BankOutlined className="text-4xl !text-blue-500" />,
      label: "Permisos de Entidad",
      selectedCount: selectedPermissions.entities.length,
      data: entities,
    },
  ];

  const handlePermissionCardClick = (type) => {
    setSelectedPermissionType(type);
    setPermissionModalVisible(true);
    setSearchText("");
  };

  const steps = [
    {
      title: "Información Básica",
      content: <ReportForm form={form} entities={entities} />,
    },
    {
      title: "Permisos",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {permissionCards.map((card) => (
            <PermissionCard
              key={card.type}
              data={card}
              onCardClick={handlePermissionCardClick}
            />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <Card className="p-4">
          <Title level={3}>Crear nuevo reporte</Title>
          <Steps current={currentStep} items={steps} className="mb-8" />

          {loading || permissionsLoading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <Spin spinning={true}></Spin>
            </div>
          ) : (
            <div className="min-h-[400px]">{steps[currentStep].content}</div>
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <Button
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={isSubmitting}
              >
                Anterior
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button
                onClick={() => router.push("/reports")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button
                  type="primary"
                  onClick={handleNext}
                  disabled={isSubmitting}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleCreateReport}
                  loading={isSubmitting}
                  disabled={isSubmitting || loading || permissionsLoading}
                >
                  Crear Reporte
                </Button>
              )}
            </div>
          </div>
        </Card>

        <PermissionModal
          visible={permissionModalVisible}
          onCancel={() => setPermissionModalVisible(false)}
          title={`Agregar ${
            selectedPermissionType === "users"
              ? "Usuarios"
              : selectedPermissionType === "roles"
              ? "Roles"
              : "Entidades"
          }`}
          searchText={searchText}
          onSearch={handleSearch}
          columns={getColumns(selectedPermissionType)}
          dataSource={getFilteredData(selectedPermissionType, searchText)}
        />
      </div>
    </div>
  );
}
