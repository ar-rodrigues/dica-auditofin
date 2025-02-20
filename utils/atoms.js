import { atom } from "jotai";
import Logo from "@/public/images/logo400x400.svg";

export const navbarMenus = atom([
  {
    name: "Home",
    link: "/",
    icon: "",
  },
  {
    name: "About",
    link: "/about",
    icon: "",
  },
  {
    name: "Examples",
    link: "/examples",
    icon: "",
  },
]);

export const logoImage = atom(Logo);
