import { atom } from "jotai";
import Logo from "@/public/logo.png";

export const navbarMenus = atom([
  {
    name: "Home",
    link: "/",
    icon: "",
  },
  {
    name: "Sobre Nosotros",
    link: "/about",
    icon: "",
  },
  {
    name: "Contacto",
    link: "/contact",
    icon: "",
  },
]);

export const logoImage = atom(Logo);
