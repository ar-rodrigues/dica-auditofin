import React from "react";
import { Typography, Tag, Divider, Button, Space } from "antd";

const { Text, Paragraph } = Typography;

/**
 * Generic details component for entity assignments (requirements or formats)
 * Props:
 * - item: the assignment object
 * - fields: array of { label, value, render? } to display
 * - status: { value, activeText, inactiveText }
 * - onStatusChange: function
 * - loading: boolean
 * - statusButtonIcons: { active, inactive }
 * - children: extra custom fields (optional)
 */
export default function EntityAssignmentDetails({
  item,
  fields = [],
  status,
  onStatusChange,
  loading = false,
  statusButtonIcons = {},
  children,
}) {
  if (!item) return null;

  return (
    <div className="space-y-4">
      {fields.map((field, idx) => (
        <div key={idx}>
          <Text type="secondary" className="text-xs">
            {field.label}
          </Text>
          <Paragraph className="mt-1">
            {field.render ? field.render(item) : field.value}
          </Paragraph>
        </div>
      ))}

      {children}

      {status && (
        <>
          <Divider className="my-3" />
          <div>
            <Text type="secondary" className="text-xs">
              Estado
            </Text>
            <div className="mt-1">
              <Tag color={status.value ? "green" : "red"}>
                {status.value ? status.activeText : status.inactiveText}
              </Tag>
            </div>
          </div>
          {onStatusChange && (
            <Button
              type={status.value ? "default" : "primary"}
              danger={status.value}
              icon={
                status.value
                  ? statusButtonIcons.inactive
                  : statusButtonIcons.active
              }
              block
              onClick={() => onStatusChange(item)}
              loading={loading}
              className={`h-10 ${
                status.value
                  ? "border-red-500 text-red-600 hover:bg-red-50"
                  : "bg-green-600 hover:bg-green-700 border-green-600"
              }`}
            >
              {status.value ? status.inactiveText : status.activeText}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
