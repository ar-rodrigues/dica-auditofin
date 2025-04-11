"use client";
import { useEffect } from "react";
import PowerBIContent from "@/components/Dashboard/PowerBIContent";
import { useReports } from "@/hooks/useReports";
import { Spin } from "antd";

export default function Dashboard() {
  const { reports, fetchReports, loading: reportsLoading } = useReports();

  if (reportsLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden h-screen flex flex-col">
      <PowerBIContent reports={reports} />
    </div>
  );
}
