import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const WarningModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  content,
  confirmText = "Continuar",
  cancelText = "Cancelar",
  icon = <ExclamationCircleOutlined className="text-yellow-500 text-xl" />,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      onOk={onConfirm}
      title={
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
      }
      icon={null}
      okText={confirmText}
      cancelText={cancelText}
      okButtonProps={{
        className: "bg-blue-500 hover:bg-blue-600",
      }}
      cancelButtonProps={{
        className: "hover:bg-gray-100",
      }}
    >
      <div className="space-y-2">
        {Array.isArray(content) ? (
          content.map((text, index) => (
            <p key={index} className="text-gray-700">
              {text}
            </p>
          ))
        ) : (
          <p className="text-gray-700">{content}</p>
        )}
      </div>
    </Modal>
  );
};

export default WarningModal;
