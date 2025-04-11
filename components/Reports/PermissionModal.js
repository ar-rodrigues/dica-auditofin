import { Modal, Input, Table, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function PermissionModal({
  visible,
  onCancel,
  title,
  searchText,
  onSearch,
  columns,
  dataSource,
  rowKey = "id",
}) {
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={null}
    >
      <div className="mb-4">
        <Input
          placeholder="Buscar..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => onSearch(e.target.value)}
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={rowKey}
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
        }}
      />
    </Modal>
  );
}
