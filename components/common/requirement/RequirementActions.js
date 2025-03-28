import React from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  Input,
  Upload,
  Divider,
  Space,
  message,
} from "antd";
import {
  FileOutlined,
  UploadOutlined,
  SendOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

const RequirementActions = ({
  requirement,
  isAuditor,
  comment,
  setComment,
  onApprove,
  onReject,
  onUpload,
  buttonText = "Enviar",
  acceptedFileTypes = "",
  maxFileSize = 10, // in MB
}) => {
  // Create accepted file types for upload component
  const getAcceptedFileTypes = () => {
    if (acceptedFileTypes) return acceptedFileTypes;

    // Default accepted types based on requirement.file_type if available
    if (requirement.file_type) {
      switch (requirement.file_type.type.toLowerCase()) {
        case "pdf":
          return ".pdf";
        case "excel":
          return ".xlsx,.xls";
        case "word":
          return ".docx,.doc";
        case "imagen":
          return ".jpg,.jpeg,.png,.gif";
        default:
          return "";
      }
    }
    return "";
  };

  const handleFileUpload = (info) => {
    const { file } = info;

    // Check file size
    if (file.size / 1024 / 1024 > maxFileSize) {
      message.error(`El archivo no debe exceder ${maxFileSize}MB`);
      return;
    }

    // Check file type if needed
    const acceptedTypes = getAcceptedFileTypes();
    if (acceptedTypes) {
      const fileExtension = `.${file.name.split(".").pop().toLowerCase()}`;
      const isAccepted = acceptedTypes
        .split(",")
        .some((type) => type.trim().toLowerCase() === fileExtension);

      if (!isAccepted) {
        message.error(
          `Tipo de archivo no aceptado. Por favor sube: ${acceptedTypes}`
        );
        return;
      }
    }

    if (onUpload) {
      onUpload(file);
    }
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) return;

    // In a real app, this would send the comment to the backend
    message.success("Comentario enviado correctamente");
    if (setComment) setComment("");
  };

  return (
    <Card title={isAuditor ? "Revisar documento" : "Acciones"}>
      {isAuditor ? (
        <>
          {requirement.latestFile ? (
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} md={16}>
                <Space>
                  <FileOutlined style={{ fontSize: 24 }} />
                  <div>
                    <Text strong>{requirement.latestFile.name}</Text>
                    <br />
                    <Button
                      type="link"
                      icon={<EyeOutlined />}
                      href={requirement.latestFile.url}
                      target="_blank"
                      style={{ paddingLeft: 0 }}
                    >
                      Ver documento
                    </Button>
                  </div>
                </Space>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: "right" }}>
                <Space>
                  <Button
                    type="primary"
                    onClick={() => onApprove && onApprove(requirement.id)}
                  >
                    Aprobar
                  </Button>
                  <Button
                    danger
                    onClick={() => onReject && onReject(requirement.id)}
                  >
                    Rechazar
                  </Button>
                </Space>
              </Col>
            </Row>
          ) : (
            <div
              style={{
                backgroundColor: "#FFFBE6",
                padding: 16,
                borderRadius: 8,
                textAlign: "center",
              }}
            >
              <Text type="warning">
                Aún no se ha subido ningún archivo para este requerimiento.
              </Text>
            </div>
          )}
        </>
      ) : (
        <Upload.Dragger
          name="file"
          multiple={false}
          accept={getAcceptedFileTypes()}
          onChange={handleFileUpload}
          beforeUpload={() => false}
          showUploadList={false}
        >
          <p className="ant-upload-drag-icon">
            <UploadOutlined />
          </p>
          <p className="ant-upload-text">
            Haz clic o arrastra un archivo para subirlo
          </p>
          <p className="ant-upload-hint">
            Formatos aceptados: {requirement.file_type.type} (máx. {maxFileSize}
            MB)
          </p>
        </Upload.Dragger>
      )}

      <Divider />

      <div>
        <Title level={5}>Agregar comentario</Title>
        <TextArea
          rows={4}
          value={comment}
          onChange={(e) => setComment && setComment(e.target.value)}
          placeholder="Escribe tu comentario aquí..."
          style={{ marginBottom: 16 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSubmitComment}
          disabled={!comment || !comment.trim()}
        >
          {buttonText}
        </Button>
      </div>
    </Card>
  );
};

export default RequirementActions;
