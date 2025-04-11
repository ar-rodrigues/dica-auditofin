"use client";

import { useState, useEffect } from "react";
import { Form, Button, message, Card, Steps, Table } from "antd";
import { useRouter } from "next/navigation";
import { UserOutlined, TeamOutlined, BankOutlined } from "@ant-design/icons";
import { use } from "react";
import ReportForm from "@/components/Reports/ReportForm";
import PermissionCard from "@/components/Reports/PermissionCard";
import PermissionModal from "@/components/Reports/PermissionModal";

const { Step } = Steps;

export default function EditReportPage({ params }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const [selectedPermissionType, setSelectedPermissionType] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedItems, setSelectedItems] = useState({
    users: [],
    roles: [],
    entities: [],
  });
  const router = useRouter();
  const id = use(params).id;

  // Mock data - replace with your API calls
  const [data, setData] = useState({
    users: [],
    roles: [],
    entities: [],
  });

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      try {
        const [reportRes, usersRes, rolesRes, entitiesRes] = await Promise.all([
          fetch(`/api/reports?id=${id}`),
          fetch("/api/users"),
          fetch("/api/roles"),
          fetch("/api/entities"),
        ]);

        const reportData = await reportRes.json();
        form.setFieldsValue(reportData);

        // Set selected items from report data
        setSelectedItems({
          users: reportData.userIds || [],
          roles: reportData.roleIds || [],
          entities: reportData.entityIds || [],
        });

        setData({
          users: await usersRes.json(),
          roles: await rolesRes.json(),
          entities: await entitiesRes.json(),
        });
      } catch (error) {
        message.error("Error al cargar los datos");
        router.push("/reports");
      }
    };

    fetchData();
  }, [id, form, router]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          userIds: selectedItems.users,
          roleIds: selectedItems.roles,
          entityIds: selectedItems.entities,
        }),
      });

      if (response.ok) {
        message.success("Reporte actualizado correctamente");
        router.push("/reports");
      } else {
        throw new Error("Error al actualizar el reporte");
      }
    } catch (error) {
      message.error("Error al actualizar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error("Por favor complete todos los campos requeridos");
    }
  };

  const handlePermissionClick = (type) => {
    setSelectedPermissionType(type);
    setSearchText("");
    setPermissionModalVisible(true);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleSelect = (record) => {
    const type = selectedPermissionType;
    setSelectedItems((prev) => ({
      ...prev,
      [type]: prev[type].includes(record.id)
        ? prev[type].filter((id) => id !== record.id)
        : [...prev[type], record.id],
    }));
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <Button
          type={
            selectedItems[selectedPermissionType]?.includes(record.id)
              ? "primary"
              : "default"
          }
          onClick={() => handleSelect(record)}
        >
          {selectedItems[selectedPermissionType]?.includes(record.id)
            ? "Seleccionado"
            : "Seleccionar"}
        </Button>
      ),
    },
  ];

  const filteredData =
    data[selectedPermissionType]?.filter((item) =>
      item?.name?.toLowerCase().includes(searchText.toLowerCase())
    ) || [];

  const steps = [
    {
      title: "Información Básica",
      content: <ReportForm form={form} onFinish={handleSubmit} />,
    },
    {
      title: "Permisos",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PermissionCard
            type="users"
            icon={<UserOutlined className="text-4xl text-blue-500" />}
            label="Permisos de Usuario"
            selectedCount={selectedItems.users.length}
            onClick={() => handlePermissionClick("users")}
          />
          <PermissionCard
            type="roles"
            icon={<TeamOutlined className="text-4xl text-green-500" />}
            label="Permisos de Rol"
            selectedCount={selectedItems.roles.length}
            onClick={() => handlePermissionClick("roles")}
          />
          <PermissionCard
            type="entities"
            icon={<BankOutlined className="text-4xl text-purple-500" />}
            label="Permisos de Entidad"
            selectedCount={selectedItems.entities.length}
            onClick={() => handlePermissionClick("entities")}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 pb-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Editar Reporte</h1>

        <Card>
          <Steps current={currentStep} className="mb-8">
            {steps.map((step) => (
              <Step key={step.title} title={step.title} />
            ))}
          </Steps>

          <div className="min-h-[400px]">{steps[currentStep].content}</div>

          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <Button onClick={() => setCurrentStep(currentStep - 1)}>
                Anterior
              </Button>
            )}
            <div className="flex gap-2 ml-auto">
              <Button onClick={() => router.push("/reports")}>Cancelar</Button>
              {currentStep < steps.length - 1 ? (
                <Button type="primary" onClick={handleNext}>
                  Siguiente
                </Button>
              ) : (
                <Button type="primary" onClick={() => form.submit()}>
                  Actualizar Reporte
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
          columns={columns}
          dataSource={filteredData}
        />
      </div>
    </div>
  );
}
