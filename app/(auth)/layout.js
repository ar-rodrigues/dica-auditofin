import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";

import { Layout } from "antd";

import { Content, Footer } from "antd/es/layout/layout";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_NAME = "Dica México";
const APP_DEFAULT_TITLE = "Dica México";
const APP_TITLE_TEMPLATE = "%s - Dica México";
const APP_DESCRIPTION = "Aplicación de auditoría de Dica México";

export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  themeColor: "#020381",
};

export default function AuthLayout({ children }) {
  return (
    <html lang="es-MX">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <AntdRegistry>
          <Layout style={{ maxWidth: "100%" }}>
            <Navbar />
            <Content>{children}</Content>
            <Footer className="!bg-primary !text-white text-center">
              Dica ©2025 Created by Dica
            </Footer>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
