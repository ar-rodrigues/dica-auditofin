import { Card } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const PermissionCard = ({ data, onCardClick }) => {
  return (
    <Card
      hoverable
      className="cursor-pointer transition-all duration-200 hover:shadow-lg"
      onClick={() => onCardClick(data.type)}
    >
      <div className="flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-4">{data.icon}</div>
        <h3 className="text-lg font-medium mb-2">{data.label}</h3>
        <p className="text-gray-600">
          {data.selectedCount}{" "}
          {data.selectedCount === 1 ? "seleccionado" : "seleccionados"}
          {data.selectedCount > 0 && (
            <CheckCircleOutlined className="ml-2 !text-green-500" />
          )}
        </p>
      </div>
    </Card>
  );
};

export default PermissionCard;
