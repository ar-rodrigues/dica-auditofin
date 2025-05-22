"use client";
import React, { useState, useEffect } from "react";
import { Flex, Badge } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { useAtom } from "jotai";
import {
  sidebarItems,
  loadingAtom,
  findMenuItem,
  MOBILE_BREAKPOINT,
} from "@/utils/atoms";
import { useUserRole } from "@/hooks/useUserRole";
import Logout from "@/components/Logout";
import { getCurrentMenuKey } from "@/utils/getCurrentMenuKey";

export default function TabMenu() {
  const [loading, setLoading] = useAtom(loadingAtom);
  const router = useRouter();
  const pathname = usePathname();
  const { userRole, loading: loadingUserRole } = useUserRole();

  //console.log(userRole);

  const [current, setCurrent] = useState(() =>
    getCurrentMenuKey(pathname, sidebarItems)
  );

  // Update selected key when path changes
  useEffect(() => {
    setCurrent(getCurrentMenuKey(pathname, sidebarItems));
  }, [pathname]);

  const handleTabClick = async (item) => {
    if (!item.url) return;

    setLoading(true);
    setCurrent(item.key);
    router.push(item.url);
    setTimeout(() => setLoading(false), 500);
  };

  // Check if we should show the TabMenu (on mobile only)
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsVisible(window.innerWidth <= MOBILE_BREAKPOINT);
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Filter items based on user role
  const filteredItems = sidebarItems
    .filter(
      (item) =>
        !item.children && // Only show top-level items without children in TabMenu
        (item.permissions?.length === 0 || item.permissions?.includes(userRole))
    )
    .slice(0, 5); // Limit to 5 items for the tab menu

  if (!isVisible || pathname === "/login") return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "80px",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #E8E8E8",
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
      }}
    >
      {filteredItems.map((item) => {
        const isActive = current === item.key;
        return (
          <div
            key={item.key}
            onClick={() => handleTabClick(item)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: "0 1 auto",
              width: `${100 / filteredItems.length}%`,
              maxWidth: "100px",
              height: "100%",
              cursor: "pointer",
              padding: "5px 2px",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                marginBottom: "6px",
                position: "relative",
                color: isActive ? "#1677FF" : "#8C8C8C",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {item.icon}
              {item.badge && (
                <Badge
                  count={item.badge}
                  size="small"
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-10px",
                  }}
                />
              )}
            </div>
            <div
              style={{
                fontSize: "12px",
                color: isActive ? "#1677FF" : "#8C8C8C",
                fontWeight: isActive ? 500 : 400,
                textAlign: "center",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
      <Logout isTextVisible={true} isMobile={true} />
    </div>
  );
}
