import React from "react";
import Image from "next/image";
import { useAtomValue } from "jotai";
import { logoAtoms } from "@/utils/atoms";
export default function Logo() {
  const Logo = useAtomValue(logoAtoms.default);
  return (
    <Image
      src={Logo}
      alt="Logo"
      style={{
        paddingTop: 14,
        paddingBottom: 14,
        paddingRight: 14,
        paddingLeft: 14,
      }}
      width={400}
      height={400}
    />
  );
}
