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
} from "@/utils/atoms";
import { useAtom, useAtomValue } from "jotai";
import { useRouter } from "next/navigation";

const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const logo = useAtomValue(logoAtoms.default);
  const [current, setCurrent] = useState("1");
  const [loading, setLoading] = useAtom(loadingAtom);
  const router = useRouter();

  const handleClick = async ({ key }) => {
    setLoading(true);
    const selectedItem = sidebarItems.find((item) => item.key === key);
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
        defaultSelectedKeys={["1"]}
        selectedKeys={[current]}
        mode="inline"
        items={sidebarItems}
        onClick={handleClick}
      />
    </Sider>
  );
}
