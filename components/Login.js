import React, { useState } from "react";
import { login, signup } from "@/app/(auth)/login/actions";
import { Form, Input, Button, Spin, Flex } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function Login({ setIsResetPassword }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const router = useRouter();
  const onFinish = async (values) => {
    try {
      setLoading(true);
      setErrorMessage();
      let result = await login(values);
      if (result.success) {
        setLoading(false);
        router.push("/dashboard");
      } else {
        setLoading(false);
        setErrorMessage("Incorrect email or password.");
        setTimeout(() => setErrorMessage(), 3000); // Clear error after 3 seconds
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage("Error on login: " + error.message);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
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
      onFinish={onFinish}
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

      <Form.Item
        label="Contraseña"
        name="password"
        style={{ width: "100%", marginBottom: "0px" }}
        rules={[
          {
            required: true,
            message: "Please input your password!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item className="flex m-0 p-0" style={{ width: "100%" }}>
        <Button type="link" onClick={() => setIsResetPassword(true)}>
          Forgot Password?
        </Button>
      </Form.Item>

      {errorMessage && (
        <Form.Item style={{ color: "red", marginBottom: "16px" }}>
          {errorMessage}
        </Form.Item>
      )}

      <Form.Item label={null}>
        {loading ? (
          <Flex justify="center" align="center">
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </Flex>
        ) : (
          <>
            {/* <InstallPWA /> */}
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </>
        )}
      </Form.Item>
    </Form>
  );
}
