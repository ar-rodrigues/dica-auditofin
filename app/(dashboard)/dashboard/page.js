"use client";
import { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { loadingAtom, dashboardsAtom } from "@/utils/atoms";
import DashboardContent from "@/components/DashboardContent";

export default function Dashboard() {
  const [, setLoading] = useAtom(loadingAtom);
  const dashboards = useAtomValue(dashboardsAtom);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return <DashboardContent dashboards={dashboards} />;
}
