import { Card, Statistic } from "antd";
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <Statistic
          title="Total Requerimientos"
          value={requirements.length}
          prefix={<FileOutlined style={{ color: colors.primary }} />}
        />
      </Card>
      <Card>
        <Statistic
          title="Copias Certificadas"
          value={requirements.filter((r) => r.certified).length}
          prefix={<FileDoneOutlined style={{ color: colors.secondary }} />}
        />
      </Card>
      <Card>
        <Statistic
          title="Originales Requeridos"
          value={requirements.filter((r) => r.original).length}
          prefix={<ClockCircleOutlined style={{ color: colors.black }} />}
        />
      </Card>
    </div>
  );
}
