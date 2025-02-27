"use client";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { loadingAtom } from "@/utils/atoms";
import DashboardContent from "@/components/DashboardContent";

export default function Dashboard() {
  const [, setLoading] = useAtom(loadingAtom);

  useEffect(() => {
    setLoading(false);
  }, [setLoading]);

  return <DashboardContent />;
}
