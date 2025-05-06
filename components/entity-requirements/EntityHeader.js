import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

const EntityHeader = ({ onSearch }) => {
  return (
    <Search
      placeholder="Buscar entidades..."
      allowClear
      onSearch={onSearch}
      onChange={(e) => onSearch(e.target.value)}
      prefix={<SearchOutlined className="text-gray-400" />}
      className="w-full sm:w-72 transition-all duration-300 hover:shadow-sm focus-within:shadow-sm"
      style={{
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}
    />
  );
};

export default EntityHeader;
