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
        record.delivered ? (
          <Tag color="green">Entregado</Tag>
        ) : (
          <Tag color="red">Faltante</Tag>
        ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={filteredRequirements}
      rowKey="id"
      className="bg-white rounded-lg shadow"
      scroll={{ x: "max-content" }}
      size="small"
      pagination={{
        responsive: true,
        position: ["bottomCenter"],
        showSizeChanger: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} de ${total} items`,
      }}
    />
  );
}
