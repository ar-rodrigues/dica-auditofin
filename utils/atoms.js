import { atom } from "jotai";
import LogoWhite from "@/public/images/logo-blanco-300x200.png";
import Logo from "@/public/images/logo-300x200.png";
import Office from "@/public/images/content/office.png";
import Team from "@/public/images/content/team.jpg";
import Team2 from "@/public/images/content/team2.jpg";
import Team3 from "@/public/images/content/team3.jpg";

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
export const logoWhiteImage = atom(LogoWhite);
export const officeImage = atom(Office);
export const teamImage = atom(Team);
export const teamImage2 = atom(Team2);
export const teamImage3 = atom(Team3);
