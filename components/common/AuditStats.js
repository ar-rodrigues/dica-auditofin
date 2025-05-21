import React from "react";
import {
  FileTextOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import StatCard from "./StatCard";

const AuditStats = ({ stats, customIcons }) => {
  // Merge custom icons with fallback defaults
  const icons = { ...customIcons };

  // Get all stat keys in the order they appear in the stats prop
  const statKeys = Object.keys(stats);

  return (
    <div className="audit-stats-grid mb-8">
      {statKeys.map((key, idx) => (
        <div
          key={key}
          className={idx === 0 ? "audit-stats-total" : "audit-stats-regular"}
        >
          <StatCard
            title={icons[key]?.title || key}
            value={stats[key]}
            icon={icons[key]?.icon}
            iconColor={icons[key]?.color || "#1890ff"}
          />
        </div>
      ))}
      <style jsx global>{`
        @media (max-width: 767px) {
          .audit-stats-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto auto auto;
            gap: 16px;
            padding: 0 0 16px 0;
          }
          .audit-stats-total {
            grid-column: 1 / span 2;
            grid-row: 1;
            margin-bottom: 4px;
          }
          .audit-stats-regular:nth-child(2) {
            grid-column: 1;
            grid-row: 2;
          }
          .audit-stats-regular:nth-child(3) {
            grid-column: 2;
            grid-row: 2;
          }
          .audit-stats-regular:nth-child(4) {
            grid-column: 1;
            grid-row: 3;
          }
          .audit-stats-regular:nth-child(5) {
            grid-column: 2;
            grid-row: 3;
          }
        }
        @media (min-width: 768px) {
          .audit-stats-grid {
            display: grid;
            grid-template-columns: repeat(${statKeys.length}, 1fr);
            gap: 12px;
            max-width: 900px;
            margin: 0 auto;
          }
          .audit-stats-total,
          .audit-stats-regular {
            grid-column: unset;
            grid-row: unset;
            min-width: 0;
            max-width: 160px;
            width: 100%;
            margin: 0 auto;
          }
        }
      `}</style>
    </div>
  );
};

export default AuditStats;
