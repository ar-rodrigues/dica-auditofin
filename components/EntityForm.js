import {
  Form,
  Input,
  Button,
  Space,
  Row,
  Col,
  Card,
  Switch,
  message,
} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUploadFile } from "@/hooks/useUploadFile";
import { useFormSubmit } from "@/hooks/useFormSubmit";
import ImageUpload from "@/components/common/ImageUpload";

const { TextArea } = Input;

export default function EntityForm({
  initialValues,
  onSubmit,
  mode = "create",
}) {
  const [form] = Form.useForm();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const { uploadFile } = useUploadFile();
  const { handleSubmit: handleFormSubmit } = useFormSubmit("/api/entities");

  //nsole.log("logoFile", logoFile);
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const cleanValues = {
        entity_name: values.entity_name,
        description: values.description,
        is_active: values.is_active ?? true,
        entity_logo: null,
      };

      if (logoFile) {
        try {
          const path = initialValues?.id ? `${initialValues.id}` : "temp";

          const logoUrl = await uploadFile(logoFile, "entities", path);
          cleanValues.entity_logo = logoUrl;
        } catch (error) {
          console.error("Error uploading logo:", error);
          message.error("Error uploading logo");
          return;
        }
      } else if (initialValues?.entity_logo) {
        cleanValues.entity_logo = initialValues.entity_logo;
      }

      await handleFormSubmit(cleanValues, initialValues?.id);

      message.success(
        `Entidad ${mode === "create" ? "creada" : "actualizada"} exitosamente`
      );
      router.push("/entities");
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      message.error("Error al procesar el formulario");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = ({ file }) => {
    setLogoFile(file);
  };

  return (
    <Card className="w-full max-w-5xl mx-auto">
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          ...initialValues,
          is_active: initialValues?.is_active ?? true,
        }}
        onFinish={handleSubmit}
        className="w-full"
      >
        <Row gutter={[24, 0]} align="top">
          <Col xs={24} className="text-center mb-6">
            <ImageUpload
              initialImage={initialValues?.entity_logo}
              uploadText="Agregar Logo"
              changeText="Cambiar Logo"
              onImageChange={handleImageChange}
            />
          </Col>

          <Col xs={24}>
            <Form.Item
              name="entity_name"
              label="Nombre de la Entidad"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese el nombre de la entidad",
                },
              ]}
            >
              <Input placeholder="Ingrese el nombre de la entidad" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              name="description"
              label="Descripción"
              rules={[
                {
                  required: true,
                  message: "Por favor ingrese una descripción",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder="Ingrese una descripción detallada de la entidad"
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item name="is_active" label="Activo" valuePropName="checked">
              <Switch defaultChecked={initialValues?.is_active ?? true} />
            </Form.Item>
          </Col>

          <Col xs={24} className="mt-6 flex justify-end">
            <Space>
              <Button onClick={() => router.push("/entities")}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {mode === "create" ? "Crear Entidad" : "Actualizar Entidad"}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
