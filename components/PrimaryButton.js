// ednf
import React from "react";
import { Button } from "antd";

export default function PrimaryButton({
  size = "large",
  type = "primary",
  text = "Button",
  icon,
  buttonStyles = "",
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
      className={`!bg-primary !text-terciary border-none hover:!bg-white/80 hover:!text-primary hover:border-primary hover:shadow-lg
                hover:scale-105 transition-all duration-300 shadow-lg ${buttonStyles}`}
    >
      {text}
    </Button>
  );
}
