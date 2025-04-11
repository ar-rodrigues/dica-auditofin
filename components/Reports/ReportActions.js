import { Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function ReportActions({ record, onDelete }) {
  const router = useRouter();

  return (
    <div className="flex gap-2">
      <Button
        type="primary"
        icon={<EditOutlined />}
        onClick={() => router.push(`/reports/${record.id}/edit`)}
      />
      <Popconfirm
        title="¿Estás seguro de eliminar este reporte?"
        onConfirm={() => onDelete(record.id)}
        okText="Sí"
        cancelText="No"
      >
        <Button type="primary" danger icon={<DeleteOutlined />} />
      </Popconfirm>
    </div>
  );
}
