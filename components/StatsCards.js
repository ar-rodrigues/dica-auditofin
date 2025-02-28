import { Card, Space, Statistic } from "antd";
import {
  FileOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useAtomValue } from "jotai";
import { requirementsAtom, colorsAtoms } from "@/utils/atoms";

export default function StatsCards() {
  const requirements = useAtomValue(requirementsAtom);
  const colors = useAtomValue(colorsAtoms);

  return (
    <Space className="flex flex-wrap gap-4 mb-4">
      <Card size="small">
        <Statistic
          title="Total Requerimientos"
          value={requirements.length}
          prefix={<FileOutlined style={{ color: colors.primary }} />}
        />
      </Card>
      <Card size="small">
        <Statistic
          title="Copias Certificadas"
          value={requirements.filter((r) => r.certified).length}
          prefix={<FileDoneOutlined style={{ color: colors.secondary }} />}
        />
      </Card>
      <Card size="small" className="sm:col-span-2 lg:col-span-1">
        <Statistic
          title="Originales Requeridos"
          value={requirements.filter((r) => r.original).length}
          prefix={<ClockCircleOutlined style={{ color: colors.black }} />}
        />
      </Card>
    </Space>
  );
}
