import React from "react";
import Image from "next/image";
import LogoImage from "@/public/images/logo400x400.svg";

export default function Logo() {
  return (
    <Image
      src={LogoImage}
      alt="Logo"
      style={{
        paddingTop: 24,
        paddingBottom: 14,
        paddingRight: 14,
        paddingLeft: 14,
      }}
      width={400}
      height={400}
    />
  );
}
