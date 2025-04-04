import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";
import "./globals.css";
import { Layout } from "antd";

import { Header, Content, Footer } from "antd/es/layout/layout";
import Sidebar from "@/components/Sidebar";
import LogoutButton from "@/components/Logout";
import LoadingOverlay from "@/components/LoadingOverlay";
import DashboardClientLayout from "@/components/DashboardClientLayout";

export default function DashboardLayout({ children }) {
  return (
    <html lang="es-MX">
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="Dica Mx" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="h-screen">
        <AntdRegistry>
          <LoadingOverlay />
          <DashboardClientLayout>{children}</DashboardClientLayout>
        </AntdRegistry>
      </body>
    </html>
  );
}
