"use client";
import { Button, Result } from "antd";
import { useRouter } from "next/navigation";
import "@ant-design/v5-patch-for-react-19";

export default function ErrorPage() {
  const router = useRouter();

  return (
    <Result
      status="error"
      title="Error"
      subTitle="Sorry, somenthing went wrong."
      extra={
        <Button type="primary" onClick={() => router.push(`/`)}>
          Back Home
        </Button>
      }
    />
  );
}
