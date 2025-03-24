"use client";
import { useEffect } from "react";
import { Input, Button, Tooltip, Progress } from "antd";
import {
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { usePassword } from "@/hooks/usePassword";

export default function PasswordInput({
  value,
  onChange,
  mode = "create",
  form,
  onStrengthChange,
}) {
  const {
    passwordStrength,
    handlePasswordChange,
    handlePasswordGenerate,
    getPasswordStrengthColor,
  } = usePassword(form);

  useEffect(() => {
    if (onStrengthChange && passwordStrength) {
      onStrengthChange(passwordStrength.isStrong);
    }
  }, [passwordStrength, onStrengthChange]);

  return (
    <>
      <Input.Password
        value={value}
        placeholder={
          mode === "create"
            ? "Ingrese la contraseña"
            : "Ingrese nueva contraseña"
        }
        onChange={(e) => {
          onChange?.(e);
          handlePasswordChange(e);
        }}
        iconRender={(visible) =>
          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
        }
        addonAfter={
          <Tooltip title="Generar contraseña fuerte">
            <Button
              type="text"
              icon={<KeyOutlined />}
              onClick={handlePasswordGenerate}
            />
          </Tooltip>
        }
      />
      {passwordStrength && (
        <div className="mb-4">
          <Progress
            percent={passwordStrength.score * 20}
            strokeColor={getPasswordStrengthColor(passwordStrength.score)}
            showInfo={false}
          />
          <div className="text-xs mt-1">
            {passwordStrength.isStrong ? (
              <span className="text-green-600">Contraseña fuerte</span>
            ) : (
              <span className="text-red-600">Contraseña débil</span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
