import { Avatar, Upload, Button, Space, Tooltip } from "antd";
import {
  UserOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { usePhotoChange } from "@/hooks/usePhotoChange";
import { beforeUpload } from "@/lib/uploadImages";

export default function ImageUpload({
  initialImage = null,
  size = 120,
  uploadText = "Agregar Imagen",
  changeText = "Cambiar Imagen",
  onImageChange = () => {},
}) {
  const {
    loading: photoLoading,
    imageUrl,
    file,
    handlePhotoChange,
    clearImage,
  } = usePhotoChange(initialImage);

  // Call the parent's onChange whenever our internal state changes
  const handleChange = (info) => {
    handlePhotoChange(info);
    if (info.file.status === "done" || info.file.status === "error") {
      onImageChange({ file: info.file.originFileObj, imageUrl: imageUrl });
    }
  };

  const handleClear = () => {
    clearImage();
    onImageChange({ file: null, imageUrl: null });
  };

  return (
    <div className="text-center">
      <div className="mb-4">
        <Avatar
          size={size}
          icon={<UserOutlined />}
          src={imageUrl || undefined}
        />
      </div>
      <Space>
        <Upload
          showUploadList={false}
          onChange={handleChange}
          beforeUpload={beforeUpload}
        >
          <Button icon={<UploadOutlined />} loading={photoLoading}>
            {imageUrl ? changeText : uploadText}
          </Button>
        </Upload>
        {imageUrl && (
          <Tooltip title="Eliminar Imagen">
            <Button icon={<DeleteOutlined />} onClick={handleClear} danger />
          </Tooltip>
        )}
      </Space>
    </div>
  );
}
