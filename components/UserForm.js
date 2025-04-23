import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  Card,
  message,
  Switch,
  Tooltip,
} from "antd";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { KeyOutlined, CheckOutlined } from "@ant-design/icons";

import { useStorageFile } from "@/hooks/useStorageFile";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import ImageUpload from "@/components/common/ImageUpload";
import PasswordInput from "@/components/common/PasswordInput";

const { Option } = Select;

export default function UserForm({
  initialValues,
  onSubmit,
  mode = "create",
  roles,
  entities,
  rolesLoading,
  entitiesLoading,
  rolesError,
  entitiesError,
}) {
  const [form] = Form.useForm();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [passwordIsStrong, setPasswordIsStrong] = useState(false);

  const [photoFile, setPhotoFile] = useState(null);
  const { uploadFile } = useStorageFile();
  const { handleSubmit: handleFormSubmit } = useFormSubmit("/api/users");

  const handleResetPassword = async () => {
    try {
      setResetPasswordLoading(true);
      const baseUrl = window.location.origin;
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.getFieldValue("email"),
          baseUrl,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetPasswordSuccess(true);
        message.success(
          "Se ha enviado un correo para restablecer la contraseña"
        );
      } else {
        throw new Error(data.error || "Error al enviar el correo");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      message.error("Error al enviar el correo de restablecimiento");
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const cleanValues = {
        ...values,
      };

      if (photoFile) {
        try {
          const path = initialValues?.id ? `${initialValues.id}` : "temp";

          const photoUrl = await uploadFile(photoFile, "profiles", path);
          cleanValues.photo = photoUrl;
        } catch (error) {
          console.error("Error uploading photo:", error);
          message.error("Error al subir la foto");
          return;
        }
      } else if (initialValues?.photo) {
        cleanValues.photo = initialValues.photo;
      }

      await handleFormSubmit(cleanValues, initialValues?.id);

      message.success(
        `Usuario ${mode === "create" ? "creado" : "actualizado"} exitosamente`
      );
      router.push("/users");
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      message.error("Error al procesar el formulario");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = ({ file }) => {
    setPhotoFile(file);
  };

  const handlePasswordStrengthChange = (isStrong) => {
    setPasswordIsStrong(isStrong);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialValues,
          role: initialValues?.role?.id,
          entity: initialValues?.entity?.id,
          is_active: initialValues?.is_active ?? true,
        }}
        onFinish={handleSubmit}
        className="w-full"
      >
        <Row gutter={[24, 0]} align="top">
          <Col xs={24} md={8} className="text-center mb-6">
            <ImageUpload
              initialImage={initialValues?.photo}
              uploadText="Agregar Foto"
              changeText="Cambiar Foto"
              onImageChange={handleImageChange}
            />
          </Col>

          <Col xs={24} md={16}>
            <Row gutter={[16, 0]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="first_name"
                  label="Nombre"
                  rules={[
                    { required: true, message: "Por favor ingrese el nombre" },
                  ]}
                >
                  <Input placeholder="Ingrese el nombre" />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="last_name"
                  label="Apellido"
                  rules={[
                    {
                      required: true,
                      message: "Por favor ingrese el apellido",
                    },
                  ]}
                >
                  <Input placeholder="Ingrese el apellido" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Por favor ingrese el email" },
                    {
                      type: "email",
                      message: "Por favor ingrese un email válido",
                    },
                  ]}
                >
                  <Input placeholder="Ingrese el email" />
                </Form.Item>
              </Col>

              <Col xs={24}>
                {mode === "create" ? (
                  <Form.Item
                    name="password"
                    label="Contraseña"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese la contraseña",
                      },
                      {
                        validator: (_, value) => {
                          if (!value || passwordIsStrong) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "La contraseña no es lo suficientemente fuerte"
                          );
                        },
                      },
                    ]}
                  >
                    <PasswordInput
                      mode={mode}
                      form={form}
                      onStrengthChange={handlePasswordStrengthChange}
                    />
                  </Form.Item>
                ) : (
                  <Form.Item label="Contraseña">
                    <Tooltip
                      title="Se enviará un enlace al usuario para restablecer la contraseña"
                      placement="top"
                    >
                      {resetPasswordSuccess ? (
                        <Button icon={<CheckOutlined />} disabled>
                          Correo enviado
                        </Button>
                      ) : (
                        <Button
                          icon={<KeyOutlined />}
                          onClick={handleResetPassword}
                          loading={resetPasswordLoading}
                        >
                          Restablecer contraseña
                        </Button>
                      )}
                    </Tooltip>
                  </Form.Item>
                )}
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="role"
                  label="Rol"
                  rules={[
                    { required: true, message: "Por favor seleccione un rol" },
                  ]}
                >
                  <Select
                    placeholder="Seleccione un rol"
                    loading={rolesLoading}
                    disabled={rolesLoading}
                  >
                    {roles?.map((role) => (
                      <Option
                        key={role.id}
                        value={role.id}
                        label={role.role?.toUpperCase()}
                      >
                        {role.role?.toUpperCase()}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="entity"
                  label="Entidad"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione una entidad",
                    },
                  ]}
                >
                  <Select
                    placeholder="Seleccione una entidad"
                    loading={entitiesLoading}
                    disabled={entitiesLoading}
                  >
                    {entities?.map((entity) => (
                      <Option
                        key={entity.id}
                        value={entity.id}
                        label={entity.entity_name}
                      >
                        {entity.entity_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="is_active"
                  label="Activo"
                  valuePropName="checked"
                >
                  <Switch checked={initialValues?.is_active ?? true} />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col xs={24} className="mt-6 flex justify-end">
            <Space>
              <Button onClick={() => router.push("/users")}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {mode === "create" ? "Crear Usuario" : "Actualizar Usuario"}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
