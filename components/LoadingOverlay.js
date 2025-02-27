"use client";
import { Spin } from "antd";
import { useAtomValue } from "jotai";
import { loadingAtom } from "@/utils/atoms";

export default function LoadingOverlay() {
  const loading = useAtomValue(loadingAtom);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1001] flex items-center justify-center">
      <Spin size="large" />
    </div>
  );
}
