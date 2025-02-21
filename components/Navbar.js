"use client";

import React from "react";
import { Flex, Col, Row } from "antd";
import Image from "next/image";
import { useAtomValue } from "jotai";
import { navbarMenus, logoImage } from "@/utils/atoms";

const containerStyle = {
  padding: "5px",
};
const menuStyle = {
  marginBottom: "10px",
  gap: "25px",
  padding: "5px",
  justifyContent: "end",
  alignItems: "center",
  width: "auto",
  height: "100%",
};
const logoStyle = {
  marginBottom: "10px",
  padding: "5px",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  height: "100%",
};

export default function Navbar() {
  const menus = useAtomValue(navbarMenus);
  const logo = useAtomValue(logoImage);

  if (!menus) {
    throw new Error("Navbar: menus is required");
  } else if (menus.length < 1) {
    throw new Error("Navbar: menus must have at least one item");
  } else if (!logo) {
    throw new Error("Navbar: logo is required");
  }
  return (
    <Row gutter={[4, 4]} span={24} style={containerStyle}>
      <Col xs={24} sm={6} md={6} span={6}>
        <Flex style={logoStyle}>
          <Image width={50} height={50} src={logo} alt="Logo" />
        </Flex>
      </Col>
      <Col xs={0} sm={12} md={16} span={18}>
        <Flex style={menuStyle}>
          {menus.map(({ name, link, icon }, index) => (
            <a
              key={index}
              href={link}
              className="text-white hover:text-gray-300 w-20 text-nowrap"
            >
              {name}
            </a>
          ))}
        </Flex>
      </Col>
    </Row>
  );
}
