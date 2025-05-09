"use client";
import React, { useState, useEffect } from "react";
import { Flex, Layout, Menu } from "antd";
import Image from "next/image";
import {
  logoAtoms,
  sidebarCollapsedAtom,
  loadingAtom,
  sidebarItems,
  sidebarLogoStyle,
  MOBILE_BREAKPOINT,
  findMenuItem,
} from "@/utils/atoms";
import { useAtom, useAtomValue } from "jotai";
import { useRouter, usePathname } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";
import { getCurrentMenuKey } from "@/utils/getCurrentMenuKey";
const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const logo = useAtomValue(logoAtoms.default);
  const [loading, setLoading] = useAtom(loadingAtom);
  const router = useRouter();
  const pathname = usePathname();
  const { userRole, loading: loadingUserRole } = useUserRole();

  const [current, setCurrent] = useState(() =>
    getCurrentMenuKey(pathname, sidebarItems)
  );

  // Update selected key when path changes
  useEffect(() => {
    setCurrent(getCurrentMenuKey(pathname, sidebarItems));
  }, [pathname]);

  const handleClick = async ({ key }) => {
    setLoading(true);
    const selectedItem = findMenuItem(sidebarItems, key);
    if (selectedItem?.url) {
      setCurrent(key);
      router.push(selectedItem.url);
    }
    setTimeout(() => setLoading(false), 500);
  };

  // Handle sidebar collapse
  const handleCollapse = (isCollapsed) => {
    setCollapsed(isCollapsed);

    // Save state to localStorage
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(isCollapsed));
    }
  };

  // Load saved state on mount
  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const savedState = localStorage.getItem("sidebarCollapsed");
      if (savedState !== null) {
        setCollapsed(JSON.parse(savedState));
      }
    }
  }, [setCollapsed]);

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  // Filter items based on user role
  const filteredItems = sidebarItems.filter(
    (item) =>
      item.permissions.length === 0 || item.permissions.includes(userRole)
  );

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      breakpoint="lg"
      width={256}
      collapsedWidth={80}
      style={{
        height: "100%",
        minHeight: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      <Flex
        align="center"
        justify="center"
        style={{
          ...sidebarLogoStyle,
          height: "50px",
          margin: "10px",
          background: "var(--color-white)",
          overflow: "hidden",
        }}
      >
        <Image
          width={collapsed ? 32 : 40}
          height={collapsed ? 32 : 40}
          src={logo}
          alt="Logo"
        />
      </Flex>
      <Menu
        theme="dark"
        defaultSelectedKeys={[current]}
        selectedKeys={[current]}
        mode="inline"
        items={filteredItems}
        onClick={handleClick}
        style={{
          height: "calc(100vh - 70px)",
          overflowY: "auto",
        }}
      />
    </Sider>
  );
}
