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
    <Space className="flex flex-wrap gap-4 mb-4 w-full">
      <Card size="small" className="flex-1 min-w-[200px]">
        <Statistic
          title="Total Requerimientos"
          value={requirements.length}
          prefix={<FileOutlined style={{ color: colors.primary }} />}
        />
      </Card>
      <Card size="small" className="flex-1 min-w-[200px]">
        <Statistic
          title="Entregados"
          value={requirements.filter((r) => r.delivered).length}
          prefix={<FileDoneOutlined style={{ color: colors.secondary }} />}
        />
      </Card>
      <Card size="small" className="flex-1 min-w-[200px]">
        <Statistic
          title="Faltantes"
          value={requirements.filter((r) => !r.delivered).length}
          prefix={<ClockCircleOutlined style={{ color: colors.black }} />}
        />
      </Card>
    </Space>
  );
}
