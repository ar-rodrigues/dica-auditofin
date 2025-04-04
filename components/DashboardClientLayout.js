"use client";

import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import Sidebar from "@/components/Sidebar/Sidebar";
import LogoutButton from "@/components/Logout";
import { useAtomValue } from "jotai";
import { sidebarCollapsedAtom } from "@/utils/atoms";
import TabMenu from "@/components/TabMenu/TabMenu";

const DashboardClientLayout = ({ children, isMobile }) => {
  const sidebarCollapsed = useAtomValue(sidebarCollapsedAtom);
  const [marginLeft, setMarginLeft] = useState(80); // Default to collapsed width

  // Update margin when sidebar collapses/expands
  useEffect(() => {
    setMarginLeft(sidebarCollapsed ? 80 : 256);
  }, [sidebarCollapsed]);

  return (
    <Layout className="min-h-screen">
      {isMobile ? (
        <Layout>
          <TabMenu />
          <Content>{children}</Content>
        </Layout>
      ) : (
        <div className="flex w-full">
          <Sidebar />
          <Layout
            className="site-layout transition-all duration-300"
            style={{
              marginLeft: marginLeft,
              minHeight: "100vh",
            }}
          >
            <Header
              style={{
                padding: "0 16px",
                background: "#fff",
                boxShadow: "0 1px 4px var(--color-secondary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                position: "sticky",
                top: 0,
                zIndex: 1,
                width: "100%",
              }}
            >
              <LogoutButton />
            </Header>
            <Content
              style={{
                margin: "16px",
                padding: "16px",
                background: "#fff",
                borderRadius: "4px",
                minHeight: "calc(100vh - 140px)", // Header (64px) + Footer (60px) + margins
              }}
            >
              {children}
            </Content>
            <Footer
              style={{
                textAlign: "center",
                padding: "12px 24px",
              }}
            >
              Dica ©{new Date().getFullYear()}
            </Footer>
          </Layout>
        </div>
      )}
    </Layout>
  );
};

export default DashboardClientLayout;
