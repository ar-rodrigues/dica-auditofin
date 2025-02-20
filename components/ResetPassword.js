import React, { useState } from "react";
import { Form, Input, Button, Spin, Flex, Result } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { resetPassword } from "@/app/(auth)/login/actions";
import { useRouter } from "next/navigation";

export default function ResetPassword({ setIsResetPassword, isResetPassword }) {
  const [loading, setLoading] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const router = useRouter();

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onResetPassword = async (values) => {
    //console.log(values);
    try {
      const baseUrl = window.location.origin;
      const passwordReseted = await resetPassword(values.email, baseUrl);
      if (passwordReseted) {
        return setIsResetSuccess(true);
      } else {
        console.log("Error on reset password: ", passwordReseted.error);
        return setIsResetSuccess(false);
      }
    } catch (error) {
      console.log("Error on reset password: ", error.message);
      throw console.error("Error on reset password: ", error.message);
    }
  };

  if (isResetSuccess) {
    return (
      <Result
        status="success"
        title="Check your email"
        subTitle="We've sent you an email with a link to reset your password."
        className="mt-5 pt-5"
        extra={[
          <Button
            type="primary"
            key="login"
            onClick={() => {
              setIsResetPassword(false);
              router.push("/login");
            }}
          >
            Login Page
          </Button>,
        ]}
      />
    );
  }
  return (
    <Form
      layout="vertical"
      name="basic"
      style={{
        width: "100%",
        height: "100%",
        padding: "10px 24px 24px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onResetPassword}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Correo"
        name="email"
        style={{ width: "100%" }}
        rules={[
          {
            required: true,
            message: "Please input your email!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={null}>
        {loading ? (
          <Flex justify="center" align="center">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </Flex>
        ) : (
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        )}
      </Form.Item>
    </Form>
  );
}
