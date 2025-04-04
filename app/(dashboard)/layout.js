import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import "./globals.css";
import { headers } from "next/headers";

import LoadingOverlay from "@/components/LoadingOverlay";
import DashboardClientLayout from "@/components/layouts/DashboardClientLayout";

function isMobileDevice(userAgent) {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
}

export default async function DashboardLayout({ children }) {
  const headersList = await headers();
  const userAgent = await headersList.get("user-agent");
  const isMobile = isMobileDevice(userAgent);

  console.log("isMobile", isMobile);

  return (
    <html lang="es-MX">
      <body className="h-screen">
        <AntdRegistry>
          <LoadingOverlay />
          <DashboardClientLayout isMobile={isMobile}>
            {children}
          </DashboardClientLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}
