import {
  Table,
  Button,
  Space,
  Typography,
  Tag,
  Tooltip,
  Empty,
  Modal,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

const { Paragraph, Text } = Typography;

export default function RequirementsTable({
  data = [],
  documentTypes = [],
  onDelete,
}) {
  const router = useRouter();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Get document type name from the document_type object or documentTypes array
  const getDocumentTypeName = (documentType) => {
    if (!documentType) return "Desconocido";

    // If document_type is already an object with format property
    if (documentType.format) {
      return documentType.format;
    }

    // Fallback to looking up by ID in documentTypes array
    const docType = documentTypes.find(
      (type) => type.id === documentType.id || type.id === documentType
    );
    return docType ? docType.name || docType.format : "Desconocido";
  };

  const showDetailModal = (record) => {
    setSelectedItem(record);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: "Código",
      dataIndex: "ref_code",
      key: "ref_code",
      width: 80,
    },
    {
      title: "Información Requerida",
      dataIndex: "required_information",
      key: "required_information",
      width: "30%",
      ellipsis: true,
      render: (text, record) => (
        <div className="flex items-center">
          <Tooltip title="Ver detalles">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showDetailModal(record)}
              style={{ marginRight: 8 }}
            />
          </Tooltip>
          <Paragraph ellipsis={{ rows: 1 }} className="mb-0 flex-1">
            {text}
          </Paragraph>
        </div>
      ),
    },
    {
      title: "Tipo",
      dataIndex: "document_type",
      key: "document_type",
      width: 110,
      render: (documentType) => (
        <Tag color="blue">{getDocumentTypeName(documentType)}</Tag>
      ),
    },
    {
      title: "Formatos",
      dataIndex: "file_type",
      key: "file_type",
      width: 120,
      render: (fileTypes) => {
        if (!fileTypes || fileTypes.length === 0) {
          return <Tag color="default">N/A</Tag>;
        }

        return (
          <Space wrap>
            {fileTypes.map((fileType, index) => (
              <Tooltip key={index} title={fileType.extension}>
                <Tag icon={<FileOutlined />} color="green">
                  {fileType.type}
                </Tag>
              </Tooltip>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Plazos",
      key: "plazos",
      width: 120,
      render: (_, record) => (
        <div>
          <div>
            <Text type="secondary">Frecuencia:</Text> {record.frequency_by_day}
          </div>
          <div>
            <Text type="secondary">Entrega:</Text> {record.days_to_deliver} días
          </div>
        </div>
      ),
      responsive: ["sm"],
    },
    {
      title: "Fecha",
      dataIndex: "created_at",
      key: "created_at",
      width: 100,
      responsive: ["lg"],
      render: (date) => new Date(date).toLocaleDateString("es-MX"),
    },
    {
      title: "Acciones",
      key: "actions",
      width: 100,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => router.push(`/requirements/edit/${record.id}`)}
            size="middle"
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete?.(record)}
            size="middle"
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        className="bg-white rounded-lg shadow-sm"
        scroll={{ x: 800 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20", "50"],
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} requerimientos`,
        }}
        locale={{
          emptyText: (
            <Empty
              description="No hay requerimientos disponibles"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />

      <Modal
        title={
          selectedItem?.ref_code
            ? `Detalle - ${selectedItem.ref_code}`
            : "Detalle del Requerimiento"
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedItem && (
          <div className="space-y-4">
            <div>
              <Text strong>Información Requerida:</Text>
              <Paragraph>{selectedItem.required_information}</Paragraph>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>Tipo de Documento:</Text>
                <div>
                  <Tag color="blue">
                    {getDocumentTypeName(selectedItem.document_type)}
                  </Tag>
                </div>
              </div>

              <div>
                <Text strong>Tipos de Archivo:</Text>
                <div>
                  {!selectedItem.file_type ||
                  selectedItem.file_type.length === 0 ? (
                    <Tag color="default">No especificado</Tag>
                  ) : (
                    <Space wrap>
                      {selectedItem.file_type.map((fileType, index) => (
                        <Tag key={index} icon={<FileOutlined />} color="green">
                          {fileType.type}
                        </Tag>
                      ))}
                    </Space>
                  )}
                </div>
              </div>

              <div>
                <Text strong>Frecuencia (días):</Text>
                <div>{selectedItem.frequency_by_day}</div>
              </div>

              <div>
                <Text strong>Plazo de Entrega:</Text>
                <div>{selectedItem.days_to_deliver} días</div>
              </div>

              <div>
                <Text strong>Fecha de Creación:</Text>
                <div>
                  {new Date(selectedItem.created_at).toLocaleDateString(
                    "es-MX"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
