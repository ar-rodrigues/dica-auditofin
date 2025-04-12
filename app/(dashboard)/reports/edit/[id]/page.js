"use client";

import { useState, useEffect } from "react";
import {
  Form,
  Button,
  message,
  Card,
  Steps,
  Table,
  Spin,
  Typography,
} from "antd";
import { useRouter } from "next/navigation";
import { UserOutlined, TeamOutlined, BankOutlined } from "@ant-design/icons";
import { useParams } from "next/navigation";
import ReportForm from "@/components/Reports/ReportForm";
import PermissionCard from "@/components/Reports/PermissionCard";
import PermissionModal from "@/components/Reports/PermissionModal";
import { useRoles } from "@/hooks/useRoles";
import { useEntities } from "@/hooks/useEntities";
import { useUsers } from "@/hooks/useUsers";
import { useReports } from "@/hooks/useReports";
import { usePermissions } from "@/hooks/usePermissions";
import { useFetchUser } from "@/hooks/useFetchUser";
import WarningModal from "@/components/common/WarningModal";

const { Step } = Steps;
const { Title } = Typography;

export default function EditReportPage() {
  const params = useParams();
  const reportId = params.id;
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectedPermissionType, setSelectedPermissionType] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState({
    users: [],
    roles: [],
    entities: [],
  });
  const router = useRouter();
  const { roles } = useRoles();
  const { entities } = useEntities();
  const { users } = useUsers();
  const { loading, error, fetchReportById, updateReport, deleteReport } =
    useReports();
  const {
    loading: permissionsLoading,
    error: permissionsError,
    fetchPermissions,
    updatePermission,
  } = usePermissions();
  const { user } = useFetchUser();

  console.log("formData", formData);

  useEffect(() => {
    const fetchReport = async () => {
      const report = await fetchReportById(reportId);
      if (report && report[0]) {
        const reportData = report[0];
        setFormData(reportData);
        form.setFieldsValue({
          ...reportData,
          entity_id: reportData.entity_id,
        });
      }
    };
    fetchReport();
  }, []);

  useEffect(() => {
    const loadPermissions = async () => {
      const permissions = await fetchPermissions({
        assetId: reportId,
      });
      if (permissions && permissions.length > 0) {
        const permission = permissions[0];
        setSelectedPermissions({
          id: permission.id,
          users: permission.users || [],
          roles: permission.roles || [],
          entities: permission.entities || [],
        });
      }
    };

    loadPermissions();
  }, []);

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
    const columns = [
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
      columns.push({
        title: "Email",
        key: "email",
        render: (_, record) => record.email,
      });
    }

    columns.push({
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

    return columns;
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

  const validatePermissions = () => {
    return (
      selectedPermissions.users.length > 0 ||
      selectedPermissions.roles.length > 0 ||
      selectedPermissions.entities.length > 0
    );
  };

  const handleUpdateReport = async () => {
    setIsSubmitting(true);
    try {
      const hasPermissions = validatePermissions();

      if (!hasPermissions) {
        setIsWarningModalOpen(true);
      } else {
        const values = await form.validateFields();
        const reportUpdateResult = await updateReport(reportId, formData);
        if (!reportUpdateResult) {
          throw new Error("Error al actualizar el reporte");
        }

        const permissionData = {
          id: selectedPermissions.id,
          table_asset: "reports",
          asset_id: reportId,
          users: [...new Set([...(selectedPermissions.users || []), user?.id])],
          roles: selectedPermissions.roles || [],
          entities: selectedPermissions.entities || [],
        };

        const permissionUpdateResult = await updatePermission(
          permissionData.id,
          permissionData
        );
        if (!permissionUpdateResult) {
          await deleteReport(reportId);
          throw new Error("Error al actualizar los permisos");
        }

        message.success("Reporte actualizado exitosamente");
        router.push("/reports");
      }
    } catch (error) {
      console.error("Error updating report:", error);
      message.error("Error al actualizar el reporte: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWarningConfirm = async () => {
    setIsWarningModalOpen(false);
    await handleUpdateReport();
  };

  const handleWarningCancel = () => {
    setIsWarningModalOpen(false);
    setIsSubmitting(false);
  };

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
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
      selectedCount: selectedPermissions?.users?.length,
      data: users,
    },
    {
      type: "roles",
      icon: <TeamOutlined className="text-4xl !text-blue-500" />,
      label: "Permisos de Rol",
      selectedCount: selectedPermissions?.roles?.length,
      data: roles,
    },
    {
      type: "entities",
      icon: <BankOutlined className="text-4xl !text-blue-500" />,
      label: "Permisos de Entidad",
      selectedCount: selectedPermissions?.entities?.length,
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
      title: "Datos del Reporte",
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
          <Title level={3}>Editar Reporte</Title>
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
                  onClick={handleUpdateReport}
                  loading={isSubmitting}
                  disabled={isSubmitting || loading || permissionsLoading}
                >
                  Actualizar
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

        <WarningModal
          isOpen={isWarningModalOpen}
          onConfirm={handleWarningConfirm}
          onCancel={handleWarningCancel}
        />
      </div>
    </div>
  );
}
