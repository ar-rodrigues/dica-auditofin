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
