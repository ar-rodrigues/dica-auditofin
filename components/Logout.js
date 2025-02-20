"use client";
import "@ant-design/v5-patch-for-react-19";
import { useEffect, useState } from "react";
import { Button, Spin, Typography } from "antd";
const { Title } = Typography;
import { useRouter } from "next/navigation";
import { IoIosLogOut } from "react-icons/io";
import { LoadingOutlined } from "@ant-design/icons";
import { createClient } from "@/utils/supabase/client";

export default function LogoutButton({ isTextVisible }) {
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
