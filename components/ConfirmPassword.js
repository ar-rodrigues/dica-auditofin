"use client";
import { Form, Input, Button, Typography, Space, Progress } from "antd";
import { useState, useEffect } from "react";
import { newPassword } from "@/app/(auth)/reset/actions";
import zxcvbn from "zxcvbn";
import generatePassword from "generate-password";
import "@ant-design/v5-patch-for-react-19";
import { useRouter, useSearchParams } from "next/navigation";

const { Title } = Typography;

export default function ConfirmPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [form] = Form.useForm();

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Update password strength whenever password changes
  useEffect(() => {
    setPasswordStrength(zxcvbn(password).score);
  }, [password]);

  const generateStrongPassword = () => {
    const generatedPassword = generatePassword.generate({
      length: 12,
      numbers: true,
      symbols: true,
      uppercase: true,
      lowercase: true,
      strict: true,
      exclude: "`'\"|-_,.[]{}()<>:;/",
    });

    // Update both the form values and state
    setPassword(generatedPassword);
    setConfirmPassword(generatedPassword);

    form.setFieldsValue({
      password: generatedPassword,
      confirmPassword: generatedPassword,
    });
  };

  const onFinish = async ({ password }) => {
    //console.log(code);
    try {
      const result = await newPassword({ password, code });
      if (result.success) {
        console.log(result);
        router.push("/dashboard");
      } else {
        form.setFields([
          {
            name: "password",
            errors: [result.message || "Failed to reset password"],
          },
        ]);
      }
    } catch (error) {
      console.error("Error on reset password: " + error.message);
      throw new Error("Error on reset password: " + error.message);
    }
  };

  return (
    <Form
      form={form}
      className="w-full flex justify-center items-center text-center"
      name="reset-password"
      layout="vertical"
      onFinish={onFinish}
    >
      <Space direction="vertical" size="large" className="m-5 p-5">
        <Title level={3}>Reset Password</Title>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              validator: (_, value) =>
                passwordStrength >= 3
                  ? Promise.resolve()
                  : Promise.reject(new Error("Password is too weak!")),
            },
          ]}
        >
          <div>
            <Input.Password
              value={password}
              onChange={(e) => {
                const newValue = e.target.value;
                setPassword(newValue);
                form.setFieldsValue({ password: newValue });
              }}
              minLength={9}
              allowClear
            />
            <Progress
              percent={(passwordStrength + 1) * 20}
              showInfo={false}
              status={
                passwordStrength < 2
                  ? "exception"
                  : passwordStrength < 4
                  ? "normal"
                  : "success"
              }
            />
          </div>
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            value={confirmPassword}
            onChange={(e) => {
              const newValue = e.target.value;
              setConfirmPassword(newValue);
              form.setFieldsValue({ confirmPassword: newValue });
            }}
            minLength={9}
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button onClick={generateStrongPassword}>Generate</Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Space>
    </Form>
  );
}
