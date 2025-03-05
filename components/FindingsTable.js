import { Table, Tag, Button } from "antd";
import { useState } from "react";
import { CaretRightOutlined } from "@ant-design/icons";

const ExpandedContent = ({ finding }) => {
  return (
    <div className="p-4 bg-gray-50">
      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700 mb-2">
            Descripción Detallada
          </h4>
          <p className="text-gray-600 whitespace-pre-line">
            {finding.description}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Base Legal</h4>
          <ul className="list-disc list-inside text-gray-600">
            {finding.legalBasis.map((basis, index) => (
              <li key={index}>{basis}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Recomendaciones</h4>
          <ul className="list-disc list-inside text-gray-600">
            {finding.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Acciones a Tomar</h4>
          <ul className="list-disc list-inside text-gray-600">
            {finding.actionsToTake.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Responsable</h4>
            <p className="text-gray-600">{finding.responsible.name}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">
              Unidad Administrativa
            </h4>
            <p className="text-gray-600">
              {finding.responsible.administrativeUnit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function FindingsTable({ data, pagination }) {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const columns = [
    {
      title: "No.",
      dataIndex: "consecutiveNumber",
      key: "consecutiveNumber",
      width: 80,
    },
    {
      title: "Área",
      dataIndex: "area",
      key: "area",
    },
    {
      title: "Documento de origen",
      dataIndex: "sourceDocument",
      key: "sourceDocument",
    },
    {
      title: "Tipo",
      dataIndex: "observationType",
      key: "observationType",
    },
    {
      title: "Categoría",
      dataIndex: "observationCategory",
      key: "observationCategory",
      render: (text) => (
        <Tag color={text === "Nueva" ? "blue" : "green"}>{text}</Tag>
      ),
    },
    {
      title: "Nivel de Riesgo",
      dataIndex: "riskLevel",
      key: "riskLevel",
      render: (text) => (
        <Tag
          color={
            text === "Alto" ? "red" : text === "Medio" ? "orange" : "green"
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: "Monto Observado",
      dataIndex: "observationAmount",
      key: "observationAmount",
      render: (amount) =>
        `$${amount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`,
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <span className="line-clamp-2">{description}</span>
      ),
    },
    {
      title: "Detalles",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Button
          type="default"
          onClick={() => {
            setExpandedRowKeys((prev) =>
              prev.includes(record.consecutiveNumber)
                ? prev.filter((key) => key !== record.consecutiveNumber)
                : [...prev, record.consecutiveNumber]
            );
          }}
        >
          {expandedRowKeys.includes(record.consecutiveNumber)
            ? "Ocultar"
            : "Ver"}
        </Button>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={data}
        rowKey="consecutiveNumber"
        pagination={pagination}
        expandable={{
          expandedRowKeys,
          onExpandedRowsChange: setExpandedRowKeys,
          expandedRowRender: (record) => <ExpandedContent finding={record} />,
          expandIcon: () => null, // Hide the default expand icon
        }}
      />
    </div>
  );
}
