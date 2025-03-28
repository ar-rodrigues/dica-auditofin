import React from "react";
import { Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;

/**
 * Reusable search and filters component
 * @param {string} searchTerm - Current search term
 * @param {function} onSearch - Search term change handler
 * @param {string} searchPlaceholder - Placeholder for search input
 * @param {Array} filters - Array of filter configurations
 * @param {object} className - Optional additional classes
 */
const SearchAndFilters = ({
  searchTerm = "",
  onSearch,
  searchPlaceholder = "Buscar...",
  filters = [],
  className = "",
}) => {
  return (
    <Space className={`flex flex-wrap gap-4 mb-4 ${className}`}>
      <Input
        placeholder={searchPlaceholder}
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="min-w-[200px]"
      />

      {filters.map((filter) => (
        <Select
          key={filter.id}
          className="min-w-[200px]"
          value={filter.value}
          onChange={filter.onChange}
          placeholder={filter.placeholder}
          popupMatchSelectWidth={false}
        >
          {filter.options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      ))}
    </Space>
  );
};

export default SearchAndFilters;
