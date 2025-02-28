"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useEffect, useState } from "react";
import { Flex, Popover, Button } from "antd";
import Image from "next/image";
import { useAtomValue } from "jotai";
import { navbarMenus, logoAtoms, colorsAtoms } from "@/utils/atoms";
import Link from "next/link";
import { MenuOutlined } from "@ant-design/icons";

export default function Navbar() {
  const menus = useAtomValue(navbarMenus);
  const logo = useAtomValue(logoAtoms.white);
  const colors = useAtomValue(colorsAtoms);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(true);

  if (!menus || menus.length < 1 || !logo) {
    throw new Error("Navbar: required props missing");
  }

  useEffect(() => {
    if (window.innerWidth > 768) {
      setIsMobile(false);
    }
  }, []);

  return (
    <Flex className="bg-primary w-full h-20 items-center justify-between !px-10">
      {/* Logo on the left */}
      <Flex className="hover:scale-105 transition-transform duration-300">
        <Link href="/">
          <Image width={80} height={80} src={logo} alt="Logo" priority />
        </Link>
      </Flex>

      {/* Mobile Menu */}
      {isMobile && (
        <Popover
          trigger="click"
          content={
            <div
              className="flex flex-col gap-2 p-2 rounded-md"
              style={{ backgroundColor: colors.white }}
            >
              {menus.map(({ name, link }, index) => (
                <a
                  key={index}
                  href={link}
                  className="block px-4 py-2 text-primary hover:bg-opacity-80"
                >
                  {name}
                </a>
              ))}
            </div>
          }
        >
          <Button
            type="primary"
            className="!bg-secondary"
            shape="circle"
            size="large"
            icon={<MenuOutlined />}
          />
        </Popover>
      )}

      {/* Desktop Menu */}
      {!isMobile && (
        <Flex className="items-center gap-8">
          {menus.map(({ name, link }, index) => (
            <a
              key={index}
              href={link}
              className="relative text-white text-lg px-2 py-1 transition-all duration-300 hover:text-secondary"
              onMouseEnter={() => setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              {name}
              <span
                className={`absolute left-0 bottom-0 w-full h-0.5 bg-secondary transform origin-left transition-transform duration-300 ${
                  activeMenu === index ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          ))}
        </Flex>
      )}
    </Flex>
  );
}
