"use client";
import "@ant-design/v5-patch-for-react-19";
import { useEffect, useState } from "react";
import { Button, Spin, Typography } from "antd";
const { Title } = Typography;
import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
import { LoadingOutlined } from "@ant-design/icons";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton({ isTextVisible, isMobile }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.log(error);
        setError(error);
        setLoading(false);
      } else {
        setLoading(false);
        router.push("/login");
      }
    } catch (err) {
      setLoading(false);
      setError(err);
      console.log(err);
    }
  };

  if (isMobile) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 1 auto",
          width: "20%",
          maxWidth: "100px",
          height: "100%",
          cursor: "pointer",
          padding: "5px 2px",
          boxSizing: "border-box",
        }}
        onClick={handleLogout}
      >
        <div
          style={{
            fontSize: "28px",
            marginBottom: "6px",
            color: "#8C8C8C",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <Spin
              indicator={
                <LoadingOutlined
                  style={{
                    fontSize: 15,
                  }}
                  spin
                />
              }
            />
          ) : (
            <IoIosLogOut />
          )}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "#8C8C8C",
            fontWeight: 400,
            textAlign: "center",
            width: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Salir
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button onClick={handleLogout}>
        {loading ? (
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 15,
                }}
                spin
              />
            }
          />
        ) : isTextVisible ? (
          "Salir"
        ) : (
          <IoIosLogOut />
        )}
      </Button>
      {error && (
        <Title level={5} type="danger">
          {error}
        </Title>
      )}
    </div>
  );
}
