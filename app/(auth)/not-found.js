"use client";
import "@ant-design/v5-patch-for-react-19";

import { Button, Result } from "antd";
import { useRouter } from "next/navigation";
export default function AuthNotFound() {
  const router = useRouter();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => router.push("/")}>
          Back Home
        </Button>
      }
    />
  );
}
