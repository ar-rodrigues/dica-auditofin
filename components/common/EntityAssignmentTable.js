import React, { useState, useEffect } from "react";
import { Table, Button, Drawer, Divider, Avatar, Typography } from "antd";
import { ArrowLeftOutlined, BankOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

/**
 * Generic table for entity assignments (requirements or formats)
 * Props:
 * - entity: the entity object
 * - data: array of assignments (requirements or formats)
 * - columns: columns config for Table
 * - filters: React node for custom filters
 * - stats: React node for custom stats
 * - onBack: function to go back
 * - onAdd: function to add new assignment
 * - detailsComponent: component to render in Drawer (receives {item, ...props})
 * - detailsTitle: string or function for Drawer title
 * - addButtonText: string for add button
 */
export default function EntityAssignmentTable({
  entity,
  data = [],
  columns = [],
  filters = null,
  stats = null,
  onBack,
  onAdd,
  detailsComponent: DetailsComponent,
  detailsTitle = "Detalles",
  addButtonText = "Editar Asignación",
}) {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        {/* Header: Entity info and stats */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center min-w-0">
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className="mr-4 flex-shrink-0"
              ghost
            >
              Volver
            </Button>
            <Avatar
              size={48}
              icon={<BankOutlined />}
              src={entity?.entity_logo || null}
              className="mr-3 flex-shrink-0 bg-blue-600"
            />
            <div className="min-w-0">
              <Title level={4} className="!m-0 !text-lg truncate">
                {entity?.entity_name || ""}
              </Title>
              <Text type="secondary" className="text-sm truncate">
                {entity?.description || ""}
              </Text>
            </div>
            {!isMobile && (
              <Divider
                type="vertical"
                className="h-12 ml-4"
                style={{ borderLeft: "2px solid #f0f0f0", height: 48 }}
              />
            )}
          </div>
          {stats && <div>{stats}</div>}
        </div>
        {filters}
      </div>
      <div className="p-4 sm:p-8">
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{
            pageSize: 10,
            hideOnSinglePage: data.length <= 10,
          }}
          className="entity-assignment-table"
          bordered={false}
          scroll={{ x: false }}
          size={isMobile ? "small" : "middle"}
          onRow={(record) => ({
            onClick: () => {
              setSelectedItem(record);
              setIsDrawerVisible(true);
            },
            style: { cursor: "pointer" },
          })}
        />
        {onAdd && (
          <Button
            type="primary"
            onClick={onAdd}
            className={isMobile ? "w-full mt-4" : "w-auto mt-4"}
          >
            {addButtonText}
          </Button>
        )}
      </div>
      <Drawer
        title={
          typeof detailsTitle === "function"
            ? detailsTitle(selectedItem)
            : detailsTitle
        }
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        width={isMobile ? 320 : 450}
      >
        {isDrawerVisible && selectedItem && DetailsComponent && (
          <DetailsComponent
            item={selectedItem}
            closeDrawer={() => setIsDrawerVisible(false)}
          />
        )}
      </Drawer>
    </div>
  );
}
