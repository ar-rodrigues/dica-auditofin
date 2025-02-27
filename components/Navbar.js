"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Flex } from "antd";
import Image from "next/image";
import { useAtomValue } from "jotai";
import { navbarMenus, logoAtoms } from "@/utils/atoms";
import Link from "next/link";

export default function Navbar() {
  const menus = useAtomValue(navbarMenus);
  const logo = useAtomValue(logoAtoms.white);
  const [activeMenu, setActiveMenu] = useState(null);

  if (!menus || menus.length < 1 || !logo) {
    throw new Error("Navbar: required props missing");
  }

  return (
    <Flex className="bg-primary w-full h-20 items-center justify-around pr-20 mr-10">
      <Flex className="hover:scale-105 transition-transform duration-300">
        <Link href="/">
          <Image width={80} height={80} src={logo} alt="Logo" priority />
        </Link>
      </Flex>

      <Flex className="items-center gap-8 pr-10">
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
    </Flex>
  );
}
