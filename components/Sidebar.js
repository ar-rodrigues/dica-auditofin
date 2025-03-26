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
const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const logo = useAtomValue(logoAtoms.default);
  const [loading, setLoading] = useAtom(loadingAtom);
  const router = useRouter();
  const pathname = usePathname();
  const { userRole, loading: loadingUserRole } = useUserRole();

  // Find the current key based on the pathname
  const getCurrentKey = () => {
    const item = sidebarItems.find((item) => {
      const path = pathname.split("/").slice(0, 2).join("/");
      return item.url === path;
    });
    return item ? item.key : "1";
  };

  const [current, setCurrent] = useState(getCurrentKey());

  const handleClick = async ({ key }) => {
    setLoading(true);
    const selectedItem = findMenuItem(sidebarItems, key);
    if (selectedItem?.url) {
      setCurrent(key);
      router.push(selectedItem.url);
    }
    setTimeout(() => setLoading(false), 500);
  };

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="sm"
    >
      <Flex style={sidebarLogoStyle}>
        <Image width={50} height={50} src={logo} alt="Logo" />
      </Flex>
      <Menu
        theme="dark"
        defaultSelectedKeys={[current]}
        selectedKeys={[current]}
        mode="inline"
        // if permissions is empty, show all items
        items={sidebarItems.filter((item) =>
          item.permissions.length === 0
            ? true
            : item.permissions.includes(userRole)
        )}
        onClick={handleClick}
      />
    </Sider>
  );
}
