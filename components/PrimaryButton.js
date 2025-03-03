// ednf
"use client";
import "@ant-design/v5-patch-for-react-19";
import React from "react";
import { Button } from "antd";

export default function PrimaryButton({
  size = "large",
  type = "primary",
  text = "Button",
  icon,
  buttonStyles = "!bg-primary !text-terciary",
  handleClick,
  ...props
}) {
  return (
    <Button
      onClick={handleClick}
      type={type}
      size={size}
      icon={icon}
      {...props}
      className={`border-none hover:!bg-white/80 hover:!text-primary hover:border-primary hover:shadow-lg
                hover:scale-105 transition-all duration-300 shadow-lg ${buttonStyles}`}
    >
      {text}
    </Button>
  );
}
