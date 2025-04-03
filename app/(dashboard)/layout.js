import { AntdRegistry } from "@ant-design/nextjs-registry";

import LoadingOverlay from "@/components/LoadingOverlay";
import DashboardClientLayout from "@/components/DashboardClientLayout";

export default function DashboardLayout({ children }) {
  return (
    <>
      <AntdRegistry>
        <LoadingOverlay />
        <DashboardClientLayout>{children}</DashboardClientLayout>
      </AntdRegistry>
    </>
  );
}
