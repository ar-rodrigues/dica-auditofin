"use client";
import { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { loadingAtom, dashboardsAtom } from "@/utils/atoms";
import DashboardContent from "@/components/Dashboard/DashboardContent";

export default function Dashboard() {
  const [, setLoading] = useAtom(loadingAtom);
  const dashboards = useAtomValue(dashboardsAtom);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <DashboardContent dashboards={dashboards} />
    </div>
  );
}
