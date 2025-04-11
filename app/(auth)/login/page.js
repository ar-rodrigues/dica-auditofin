"use client";
import "../globals.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Col, Row, Space } from "antd";
import { createClient } from "@/utils/supabase/client";
import "@ant-design/v5-patch-for-react-19";
import Logo from "@/components/Logo";
import ResetPassword from "@/components/ResetPassword";
import Login from "@/components/Login/Login";
import InstallButton from "@/components/Login/InstallButton";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const [isResetPassword, setIsResetPassword] = useState(false);

  //const viewportWidth = window.innerWidth;
  //console.log(viewportWidth);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user) {
        router.push("/dashboard");
      }
    };

    fetchUser();
  }, []);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px - 70px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Space
        direction="vertical"
        size="middle"
        style={{ flex: 1, display: "flex", padding: "16px 0" }}
      >
        <Row
          gutter={[16, 16]}
          style={{ flex: 1 }}
          justify={"center"}
          align={"middle"}
        >
          {!isResetPassword && (
            <Col
              xs={24}
              md={8}
              style={{
                maxWidth: "200px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Logo />
            </Col>
          )}
          <Col
            xs={24}
            md={16}
            style={{
              padding: "24px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {!isResetPassword && (
              <Login
                isResetPassword={isResetPassword}
                setIsResetPassword={setIsResetPassword}
              />
            )}

            {isResetPassword && (
              <ResetPassword
                isResetPassword={isResetPassword}
                setIsResetPassword={setIsResetPassword}
              />
            )}
          </Col>
        </Row>
      </Space>
      <InstallButton />
    </div>
  );
}
