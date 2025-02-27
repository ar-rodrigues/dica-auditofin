import { Table, Tag } from "antd";
import { useAtomValue } from "jotai";
import { requirementsAtom } from "@/utils/atoms";

export default function RequirementsTable({ filteredRequirements }) {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Requerimiento",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Formato",
      dataIndex: "format",
      key: "format",
    },
    {
      title: "Estado",
      key: "status",
      render: (_, record) =>
        record.certified ? (
          <Tag color="green">Copia Certificada</Tag>
        ) : record.original ? (
          <Tag color="gold">Original Requerido</Tag>
        ) : (
          <Tag color="default">Copia Simple</Tag>
        ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredRequirements}
      rowKey="id"
      className="bg-white rounded-lg shadow"
    />
  );
}
