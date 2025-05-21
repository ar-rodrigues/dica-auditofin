import React, { useState, useEffect } from "react";
import { Table, Drawer, Divider, Avatar, Typography } from "antd";
import { BankOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function AuditAssignmentTable({
  entity,
  data = [],
  columns = [],
  filters = null,
  stats = null,
  detailsComponent: DetailsComponent,
  detailsTitle = "Detalles",
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mb-2 md:mb-4 audit-header-row">
          <div className="flex items-center min-w-0">
            <Avatar
              size={48}
              src={entity?.entity_logo || undefined}
              icon={!entity?.entity_logo ? <BankOutlined /> : undefined}
              className="mr-3 flex-shrink-0 bg-blue-600"
              alt={entity?.entity_name || "Logo"}
            />
            <div className="min-w-0">
              <Title level={4} className="!m-0 !text-lg truncate">
                {entity?.entity_name || ""}
              </Title>
              <Text type="secondary" className="text-sm truncate">
                {entity?.description || ""}
              </Text>
            </div>
          </div>
          {stats && (
            <div className="flex flex-row gap-2 md:gap-4 items-center">
              {stats}
            </div>
          )}
        </div>
        {filters && <div className="mb-2 md:mb-4">{filters}</div>}
      </div>
      <div className="p-4 sm:p-8 pt-2 sm:pt-4">
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
