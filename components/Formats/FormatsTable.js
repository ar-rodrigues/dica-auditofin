import React, { useState } from "react";
import { Table, Button, Space, Drawer, Typography, List, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const FormatsTable = ({ formats, loading, error, onEdit }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);

  const handleRowClick = (record) => {
    setSelectedFormat(record);
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedFormat(null);
  };

  const columns = [
    {
      title: "Nombre del formato",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
      responsive: ["md"],
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(record);
            }}
          >
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={formats}
        loading={loading}
        rowKey="id"
        locale={{
          emptyText: error
            ? "Error al cargar los formatos"
            : "No hay formatos registrados",
        }}
        pagination={{ pageSize: 10 }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: "pointer" },
        })}
      />
      <Drawer
        title={selectedFormat ? selectedFormat.name : ""}
        placement="right"
        width={400}
        onClose={closeDrawer}
        open={drawerVisible}
      >
        {selectedFormat && (
          <>
            <Text strong>Descripción:</Text>
            <div style={{ marginBottom: 16 }}>
              {selectedFormat.description || <em>Sin descripción</em>}
            </div>
            <Text strong>Encabezados:</Text>
            <List
              dataSource={selectedFormat.headers || []}
              locale={{ emptyText: "Sin encabezados" }}
              renderItem={(header) => (
                <List.Item>
                  <span>{header.header}</span>
                  <Tag style={{ marginLeft: 8 }}>{header.type}</Tag>
                </List.Item>
              )}
            />
          </>
        )}
      </Drawer>
    </>
  );
};

export default FormatsTable;
