import { Space, Typography, Divider } from "antd";
import { useAtomValue } from "jotai";
import { colorsAtoms } from "@/utils/atoms";

const { Title, Text } = Typography;

export default function AuditHeader() {
  const colors = useAtomValue(colorsAtoms);

  return (
    <div className="bg-white rounded-lg shadow-2xs p-6 mb-6">
      <Space direction="vertical" size="small" className="w-full">
        <div className="flex items-center justify-between">
          <Title
            level={4}
            className="text-2xl sm:text-3xl font-bold text-gray-900! mb-0"
          >
            Auditoría de Cuenta Pública
          </Title>
          <div className="text-right">
            <Text className="text-gray-500">Periodo Auditado</Text>
            <div className="font-medium text-gray-900">
              Octubre 2024 - Diciembre 2024
            </div>
          </div>
        </div>

        <Divider className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Text className="text-gray-500">Ente Auditado</Text>
            <div className="font-medium text-gray-900">
              Organismo Operador del Servicio de Limpia del Municipio de Puebla
            </div>
          </div>
          <div>
            <Text className="text-gray-500">Tipo de Auditoría</Text>
            <div className="font-medium text-gray-900">
              Auditoría de Cuenta Pública
            </div>
          </div>
        </div>
      </Space>
    </div>
  );
}
