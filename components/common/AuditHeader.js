import { Space, Typography, Divider } from "antd";

const { Title, Text } = Typography;

export default function AuditHeader({
  title = "Auditoría",
  subtitle = "",
  entityName = "",
  period = "",
  auditType = "",
}) {
  return (
    <div className="bg-white rounded-lg shadow-2xs p-4 mb-4">
      <Space direction="vertical" size={0} className="w-full">
        <div className="flex items-center justify-between">
          <Title
            level={4}
            className="text-xl sm:text-2xl font-bold text-gray-900! mb-0"
          >
            {title}
          </Title>
          <div className="text-right">
            {period && (
              <>
                <Text className="text-gray-500 text-sm">Periodo Auditado</Text>
                <div className="font-medium text-gray-900 text-sm">
                  {period}
                </div>
              </>
            )}
          </div>
        </div>

        {subtitle && (
          <div className="mb-1">
            <Text className="text-gray-500 text-sm">{subtitle}</Text>
          </div>
        )}

        <Divider className="my-2" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {entityName && (
            <div>
              <Text className="text-gray-500 text-sm">Ente Auditado</Text>
              <div className="font-medium text-gray-900 text-sm">
                {entityName}
              </div>
            </div>
          )}
          {auditType && (
            <div>
              <Text className="text-gray-500 text-sm">Tipo de Auditoría</Text>
              <div className="font-medium text-gray-900 text-sm">
                {auditType}
              </div>
            </div>
          )}
        </div>
      </Space>
    </div>
  );
}
