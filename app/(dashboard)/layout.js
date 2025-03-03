import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@ant-design/v5-patch-for-react-19";

import { Layout, Space } from "antd";

import { Header, Content, Footer } from "antd/es/layout/layout";
import Sidebar from "@/components/Sidebar";
import LogoutButton from "@/components/Logout";
import LoadingOverlay from "@/components/LoadingOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dica Auditofin",
  description: "Web Plataform for public audits",
  icons: {
    icon: "/icon.png", // /public/icon.png
    shortcut: "/shortcut-icon.png",
    apple: "/apple-icon.png",
    // you can specify multiple sizes
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="es-MX">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <LoadingOverlay />
          <Layout
            hasSider={true}
            style={{
              height: "100%",
            }}
          >
            <Sidebar />
            <Layout>
              <Header
                style={{
                  backgroundColor: "white",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <LogoutButton />
              </Header>
              <Content>{children}</Content>

              <Footer
                style={{
                  textAlign: "center",
                }}
              >
                Dica ©{new Date().getFullYear()}
              </Footer>
            </Layout>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
