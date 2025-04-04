"use client";
import "../globals.css";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Col, Row, Space } from "antd";
import { createClient } from "@/utils/supabase/client";
import "@ant-design/v5-patch-for-react-19";
import Logo from "@/components/Logo";
import ResetPassword from "@/components/ResetPassword";
import Login from "@/components/Login";

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
    <Space direction="vertical" size="middle" style={{ display: "flex" }}>
      <Row
        gutter={[16, 16]}
        style={{ padding: "5px" }}
        justify={"center"}
        align={"middle"}
      >
        {!isResetPassword && (
          <Col
            xs={24}
            md={8}
            justify="center"
            align="center"
            style={{ maxWidth: "200px" }}
          >
            <Logo />
          </Col>
        )}
        <Col
          xs={24}
          md={16}
          justify="center"
          align="center"
          style={{ padding: "24px" }}
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
  );
}
