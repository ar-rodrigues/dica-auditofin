import { Avatar, Upload, Button, Space, Tooltip, Modal, message } from "antd";
import {
  UserOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";

export default function ImageUpload({
  initialImage = null,
  size = 120,
  photoLoading = false,
  uploadText = "Agregar Imagen",
  changeText = "Cambiar Imagen",
  deleteText = "Eliminar Imagen",
  onImageChange = () => {},
  onImageRemove = () => {},
  maxSize = 2, // Max size in MB
  accept = "image/png, image/jpeg, image/jpg",
}) {
  const [confirmRemove, setConfirmRemove] = useState(false);

  return (
    <Space>
      <Space>
        <Upload
          listType="picture-card"
          showUploadList={false}
          onChange={() => {}}
          beforeUpload={false}
          className="w-full flex justify-end relative group"
        >
          <Space
            className={`!bg-transparent !border-none absolute bottom-2 left-1/2 -translate-x-1/2 ${
              initialImage
                ? "md:opacity-0 md:group-hover:opacity-100"
                : "opacity-100"
            } transition-opacity`}
          >
            <Tooltip title={uploadText}>
              <Button icon={<UploadOutlined />} loading={photoLoading} />
            </Tooltip>
            {initialImage && (
              <Tooltip title={deleteText}>
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => setConfirmRemove(true)}
                  loading={photoLoading}
                />
              </Tooltip>
            )}
          </Space>
        </Upload>
      </Space>
      <Modal
        title={deleteText}
        open={confirmRemove}
        onOk={() => {}}
        onCancel={() => setConfirmRemove(false)}
        okText="Sí, eliminar"
        cancelText="Cancelar"
      >
        <p>¿Estás seguro de querer eliminar esta imagen?</p>
      </Modal>
    </Space>
  );
}
