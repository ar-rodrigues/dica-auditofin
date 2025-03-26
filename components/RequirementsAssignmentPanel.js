import { useState, useEffect } from "react";
import { Card, List, Button, Typography, Input } from "antd";
import {
  RightOutlined,
  LeftOutlined,
  PlusOutlined,
  MinusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Text } = Typography;
const { Search } = Input;

export default function RequirementsAssignmentPanel({
  availableRequirements = [],
  selectedRequirements = [],
  onAssignmentsChange,
}) {
  const [available, setAvailable] = useState(availableRequirements);
  const [selected, setSelected] = useState(selectedRequirements);
  const [searchAvailable, setSearchAvailable] = useState("");
  const [searchSelected, setSearchSelected] = useState("");

  // Update available and selected when props change
  useEffect(() => {
    setAvailable(
      availableRequirements.filter(
        (req) => !selected.some((sel) => sel.id === req.id)
      )
    );
  }, [availableRequirements, selected]);

  useEffect(() => {
    setSelected(selectedRequirements);
  }, [selectedRequirements]);

  const handleMoveToSelected = (item) => {
    const newSelected = [...selected, item];
    setSelected(newSelected);
    setAvailable(available.filter((req) => req.id !== item.id));
    onAssignmentsChange(newSelected);
  };

  const handleMoveToAvailable = (item) => {
    const newSelected = selected.filter((req) => req.id !== item.id);
    setSelected(newSelected);
    setAvailable([...available, item]);
    onAssignmentsChange(newSelected);
  };

  const handleDoubleClick = (item, isAvailable) => {
    if (isAvailable) {
      handleMoveToSelected(item);
    } else {
      handleMoveToAvailable(item);
    }
  };

  const filterRequirements = (items, searchText) => {
    if (!searchText) return items;
    const lowerSearch = searchText.toLowerCase();
    return items.filter(
      (item) =>
        item.ref_code.toLowerCase().includes(lowerSearch) ||
        item.info.toLowerCase().includes(lowerSearch)
    );
  };

  const renderList = (items, isAvailable = true) => {
    const searchText = isAvailable ? searchAvailable : searchSelected;
    const filteredItems = filterRequirements(items, searchText);

    return (
      <div className="flex flex-col h-full">
        <div className="mb-3">
          <Search
            placeholder="Buscar requerimientos..."
            value={searchText}
            onChange={(e) =>
              isAvailable
                ? setSearchAvailable(e.target.value)
                : setSearchSelected(e.target.value)
            }
            allowClear
          />
        </div>
        <List
          size="small"
          bordered
          style={{ flex: 1, overflow: "auto" }}
          dataSource={filteredItems}
          renderItem={(item) => (
            <List.Item
              onDoubleClick={() => handleDoubleClick(item, isAvailable)}
              className="cursor-pointer hover:bg-gray-50 flex justify-between items-start"
            >
              <div className="flex flex-col flex-1">
                <Text strong>{item.ref_code}</Text>
                <Text type="secondary" className="text-sm">
                  {item.info}
                </Text>
              </div>
              <Button
                type="text"
                size="small"
                icon={isAvailable ? <PlusOutlined /> : <MinusOutlined />}
                onClick={() =>
                  isAvailable
                    ? handleMoveToSelected(item)
                    : handleMoveToAvailable(item)
                }
                className="ml-2"
              />
            </List.Item>
          )}
        />
      </div>
    );
  };

  return (
    <div className="flex gap-4">
      <Card
        title="Requerimientos Disponibles"
        className="flex-1"
        styles={{
          body: {
            padding: "12px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {renderList(available)}
      </Card>

      <Card
        title="Requerimientos Asignados"
        className="flex-1"
        styles={{
          body: {
            padding: "12px",
            height: "500px",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {renderList(selected, false)}
      </Card>
    </div>
  );
}
