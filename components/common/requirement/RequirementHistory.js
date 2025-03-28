import React, { useState } from "react";
import { Card, Typography, Timeline, Space, Button, Modal, Image } from "antd";
import {
  FileOutlined,
  MessageOutlined,
  EyeOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

const HistoryItem = ({ entry, formatDate }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <div className="history-item-content">
        <div className="history-item-header">
          <Text strong>{entry.user}</Text>
          <Text type="secondary" style={{ marginLeft: 8 }}>
            {formatDate(entry.date)}
          </Text>
        </div>
        {entry.type === "file" ? (
          <div>
            <Paragraph>Archivo subido</Paragraph>
            <Button type="link" icon={<EyeOutlined />} onClick={showModal}>
              Ver archivo
            </Button>
          </div>
        ) : (
          <Paragraph>{entry.comment}</Paragraph>
        )}
      </div>

      {entry.type === "file" && (
        <Modal
          title="Vista previa del archivo"
          open={modalVisible}
          onCancel={hideModal}
          footer={null}
          width={800}
          closeIcon={<CloseOutlined />}
        >
          {entry.fileUrl.endsWith(".pdf") ? (
            <iframe
              src={entry.fileUrl}
              style={{ width: "100%", height: "500px" }}
              title="PDF Preview"
            />
          ) : entry.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
            <Image
              src={entry.fileUrl}
              alt="Image Preview"
              style={{ maxWidth: "100%" }}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <FileOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>
                Este tipo de archivo no se puede previsualizar.{" "}
                <a
                  href={entry.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Descargar archivo
                </a>
              </p>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

const RequirementHistory = ({ requirement, formatDate }) => {
  return (
    <Card title="Historial">
      <div className="timeline-container">
        {requirement.history && requirement.history.length > 0 ? (
          <Timeline
            mode="left"
            items={requirement.history.map((entry) => ({
              key: entry.id,
              dot:
                entry.type === "file" ? <FileOutlined /> : <MessageOutlined />,
              children: <HistoryItem entry={entry} formatDate={formatDate} />,
              className: "timeline-item",
            }))}
          />
        ) : (
          <Text
            type="secondary"
            style={{ display: "block", textAlign: "center", padding: 16 }}
          >
            No hay historial disponible para este requerimiento.
          </Text>
        )}
      </div>
      <style jsx global>{`
        .timeline-container .ant-timeline-item-content {
          background-color: #f5f5f5;
          border-radius: 8px;
          padding: 0;
          margin-left: 12px;
        }

        .history-item-content {
          padding: 12px 16px;
        }

        .history-item-header {
          margin-bottom: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .timeline-item {
          margin-bottom: 24px;
        }
      `}</style>
    </Card>
  );
};

export default RequirementHistory;
