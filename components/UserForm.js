import {
  Form,
  Input,
  Select,
  Button,
  Space,
  Row,
  Col,
  Card,
  Avatar,
  Upload,
  Progress,
  Tooltip,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import {
  UserOutlined,
  UploadOutlined,
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import {
  generateStrongPassword,
  checkPasswordStrength,
} from "@/utils/passwordUtils";
import { createClient } from "@/utils/supabase/client";

const { Option } = Select;

export default function UserForm({ initialValues, onSubmit, mode = "create" }) {
  const [form] = Form.useForm();
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState(initialValues?.photo);
  const [photoFile, setPhotoFile] = useState(null);
  const [roles, setRoles] = useState([]);
  const [entities, setEntities] = useState([]);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("initialValues", initialValues);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch roles
        const rolesResponse = await fetch("/api/roles");
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);

        // Fetch entities
        const entitiesResponse = await fetch("/api/entities");
        const entitiesData = await entitiesResponse.json();
        setEntities(entitiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Error loading form data");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Handle photo upload if there's a new photo
      let photoUrl = values.photo;
      if (photoFile) {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("user-photos")
          .upload(`${Date.now()}-${photoFile.name}`, photoFile);

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("user-photos").getPublicUrl(uploadData.path);

        photoUrl = publicUrl;
      }

      // Prepare user data
      const userData = {
        ...values,
        photo: photoUrl,
        last_change: new Date().toISOString(),
      };

      // If there's a password change in edit mode, update auth.users
      if (mode === "edit" && values.password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: values.password,
        });
        if (passwordError) throw passwordError;
      }

      await onSubmit(userData);
      message.success(
        `Usuario ${mode === "create" ? "creado" : "actualizado"} exitosamente`
      );
      router.push("/users");
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al procesar el formulario");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordGenerate = () => {
    const newPassword = generateStrongPassword();
    form.setFieldsValue({ password: newPassword });
    setPasswordStrength(checkPasswordStrength(newPassword));
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    if (password) {
      setPasswordStrength(checkPasswordStrength(password));
    } else {
      setPasswordStrength(null);
    }
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handlePhotoChange = (info) => {
    if (info.file.status === "done") {
      setPhotoFile(info.file.originFileObj);
      setPhotoUrl(URL.createObjectURL(info.file.originFileObj));
    }
  };

  const getPasswordStrengthColor = (score) => {
    if (!score) return "#ff4d4f";
    if (score <= 2) return "#ff4d4f";
    if (score <= 3) return "#faad14";
    return "#52c41a";
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialValues,
        }}
        onFinish={handleSubmit}
        className="w-full"
      >
        <Row gutter={[24, 0]} align="top">
          <Col xs={24} md={8} className="text-center mb-6">
            <div className="mb-4">
              <Avatar size={120} icon={<UserOutlined />} src={photoUrl} />
            </div>
            <Form.Item
              name="photo"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                accept="image/*"
                maxCount={1}
                showUploadList={false}
                onChange={handlePhotoChange}
                beforeUpload={() => false} // Prevent auto upload
              >
                <Button icon={<UploadOutlined />} block>
                  Cambiar Foto
                </Button>
              </Upload>
            </Form.Item>
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
                <Form.Item
                  name="password"
                  label={
                    mode === "create"
                      ? "Contraseña"
                      : "Nueva Contraseña (opcional)"
                  }
                  rules={[
                    mode === "create" && {
                      required: true,
                      message: "Por favor ingrese la contraseña",
                    },
                    {
                      validator: (_, value) => {
                        if (!value || checkPasswordStrength(value).isStrong) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          "La contraseña no es lo suficientemente fuerte"
                        );
                      },
                    },
                  ].filter(Boolean)}
                >
                  <Input.Password
                    placeholder={
                      mode === "create"
                        ? "Ingrese la contraseña"
                        : "Ingrese nueva contraseña"
                    }
                    onChange={handlePasswordChange}
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    addonAfter={
                      <Tooltip title="Generar contraseña fuerte">
                        <Button
                          type="text"
                          icon={<KeyOutlined />}
                          onClick={handlePasswordGenerate}
                        />
                      </Tooltip>
                    }
                  />
                </Form.Item>
                {passwordStrength && (
                  <div className="mb-4">
                    <Progress
                      percent={passwordStrength.score * 20}
                      strokeColor={getPasswordStrengthColor(
                        passwordStrength.score
                      )}
                      showInfo={false}
                    />
                    <div className="text-xs mt-1">
                      {passwordStrength.isStrong ? (
                        <span className="text-green-600">
                          Contraseña fuerte
                        </span>
                      ) : (
                        <span className="text-red-600">Contraseña débil</span>
                      )}
                    </div>
                  </div>
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
                  <Select placeholder="Seleccione un rol">
                    {roles.map((role) => (
                      <Option key={role.id} value={role.id}>
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
                  <Select placeholder="Seleccione una entidad">
                    {entities.map((entity) => (
                      <Option key={entity.id} value={entity.id}>
                        {entity.entity_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  name="is_active"
                  label="Estado"
                  rules={[
                    {
                      required: true,
                      message: "Por favor seleccione un estado",
                    },
                  ]}
                >
                  <Select placeholder="Seleccione un estado">
                    <Option value={true}>Activo</Option>
                    <Option value={false}>Inactivo</Option>
                  </Select>
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
