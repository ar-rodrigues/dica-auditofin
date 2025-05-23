import { Space, Typography, Divider } from "antd";

const { Title, Text } = Typography;

export default function AuditHeader({
  title = "Auditoría",
  subtitle = "",
  entityName = "",
  userName = "",
  period = "",
  auditType = "",
  userType = "",
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <Space direction="vertical" size={2} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Title level={4} className="text-2xl font-bold text-gray-900 mb-1">
              {title}
            </Title>
            {subtitle && (
              <Text className="text-gray-600 text-base">{subtitle}</Text>
            )}
          </div>
          {period && (
            <div className="text-right bg-gray-50 px-4 py-2 rounded-lg">
              <Text className="text-gray-500 text-sm block">
                Periodo Auditado
              </Text>
              <Text className="font-semibold text-gray-900">{period}</Text>
            </div>
          )}
        </div>

        <Divider className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {entityName && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <Text className="text-gray-500 text-sm block mb-1">
                Ente Auditado
              </Text>
              <Text className="font-semibold text-gray-900">{entityName}</Text>
            </div>
          )}
          {userName && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <Text className="text-gray-500 text-sm block mb-1">
                {userType === "auditor" ? "Auditor" : "Usuario"}
              </Text>
              <Text className="font-semibold text-gray-900">{userName}</Text>
            </div>
          )}
          {auditType && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <Text className="text-gray-500 text-sm block mb-1">
                Tipo de Auditoría
              </Text>
              <Text className="font-semibold text-gray-900">{auditType}</Text>
            </div>
          )}
        </div>
      </Space>
    </div>
  );
}
