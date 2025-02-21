"use client";
import React, { useState } from "react";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Flex, Layout, Menu } from "antd";
import Image from "next/image";
import { logoImage } from "@/utils/atoms";
import { useAtomValue } from "jotai";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Dashboard", "1", <PieChartOutlined />),
  // getItem("Option 2", "2", <DesktopOutlined />),
  // getItem("User", "sub1", <UserOutlined />, [
  //   getItem("Tom", "3"),
  //   getItem("Bill", "4"),
  //   getItem("Alex", "5"),
  // ]),
  // getItem("Team", "sub2", <TeamOutlined />, [
  //   getItem("Team 1", "6"),
  //   getItem("Team 2", "8"),
  // ]),
  // getItem("Files", "9", <FileOutlined />),
];

export const demoLogoVertical = {
  height: "32px",
  margin: "16px",
  padding: 5,
  justifyContent: "center",
  background: "rgba(255, 255, 255)",
  borderRadius: "6px",
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const logo = useAtomValue(logoImage);
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Flex style={demoLogoVertical}>
        <Image width={50} height={50} src={logo} alt="Logo" />
      </Flex>
      <Menu
        theme="dark"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items}
      />
    </Sider>
  );
}
