import { atom, useAtom } from "jotai";
import LogoWhite from "@/public/images/logo-blanco-300x200.png";
import Logo from "@/public/images/logo-300x200.png";
import Office from "@/public/images/content/office.png";
import Team from "@/public/images/content/team.jpg";
import Team2 from "@/public/images/content/team2.jpg";
import Team3 from "@/public/images/content/team3.jpg";
import {
  DesktopOutlined,
  PieChartOutlined,
  UserOutlined,
  BankOutlined,
  LinkOutlined,
  ContainerOutlined,
  AuditOutlined,
  FundProjectionScreenOutlined,
  SettingOutlined,
} from "@ant-design/icons";

// Loading state atom
export const loadingAtom = atom(false);

// Sidebar state management
export const sidebarCollapsedAtom = atom(false);

// Colors atoms
export const colorsAtoms = atom({
  primary: "#020381",
  secondary: "#A2C224",
  tertiary: "#e5e7eb",
  white: "#ffffff",
  black: "#161617",
});
// Logos atom
export const logoAtoms = {
  default: atom(Logo),
  white: atom(LogoWhite),
};

// Carousel content atom
export const carouselContentAtom = atom([
  {
    title: "Soluciones Tecnológicas Avanzadas",
    description:
      "Impulsamos la transformación digital de tu empresa con innovación y eficiencia",
    bgColor: "from-terciary/10 to-terciary/3",
    image: Office,
    buttonText: "Explorar Soluciones",
  },
  {
    title: "Auditoría Profesional Integral",
    description:
      "Evaluaciones exhaustivas y recomendaciones estratégicas para tu negocio",
    bgColor: "from-terciary/10 to-terciary/3",
    image: Team,
    buttonText: "Conocer Servicios",
  },
  {
    title: "Consultoría Empresarial Experta",
    description: "Asesoramiento estratégico respaldado por años de experiencia",
    bgColor: "from-terciary/10 to-terciary/3",
    image: Team2,
    buttonText: "Consultar Ahora",
  },
  {
    title: "Soporte Técnico Especializado",
    description:
      "Asistencia continua y soluciones inmediatas para tu infraestructura",
    bgColor: "from-terciary/10 to-terciary/3",
    image: Team3,
    buttonText: "Solicitar Soporte",
  },
]);

export const HomeCardsAtom = atom([
  {
    title: "Innovación Tecnológica",
    desc: "Soluciones de vanguardia adaptadas a tus necesidades específicas",
  },
  {
    title: "Excelencia en Servicio",
    desc: "Comprometidos con los más altos estándares de calidad",
  },
  {
    title: "Experiencia Comprobada",
    desc: "Trayectoria sólida respaldada por casos de éxito",
  },
]);

// Navigation menus atom
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

// Sidebar related constants
export const MOBILE_BREAKPOINT = 768;

export const sidebarItems = [
  {
    key: "1",
    label: "Dashboard",
    icon: <PieChartOutlined />,
    url: "/dashboard",
    permissions: ["invitadoXalapa", "invitado", "admin", "super admin"],
  },
  //
  {
    key: "2",
    label: "Configuración",
    icon: <SettingOutlined />,
    url: "/configuration",
    permissions: ["admin", "super admin"],
    children: [
      {
        key: "2.1",
        label: "Usuarios",
        url: "/users",
        permissions: ["admin", "super admin"],
      },
      {
        key: "2.2",
        label: "Entidades",
        url: "/entities",
        permissions: ["admin", "super admin"],
      },
    ],
  },
  {
    key: "3",
    label: "Planeación",
    icon: <AuditOutlined />,
    url: "/audit",
    permissions: ["admin", "super admin"],
    children: [
      {
        key: "3.0",
        label: "Listados",
        children: [
          {
            key: "3.0.1",
            label: "Listado de Requerimientos",
            url: "/requirements",
          },
          {
            key: "3.0.2",
            label: "Listado de Formato",
            url: "/formats",
          },
        ],
      },
      {
        key: "3.1",
        label: "Asignaciones",
        children: [
          {
            key: "3.1.1",
            label: "Asignación de Requerimientos",
            url: "/entity-requirements",
          },
          {
            key: "3.1.2",
            label: "Asignación de Formato",
            url: "/entity-formats",
          },
        ],
      },
    ],
  },
  {
    key: "4",
    label: "Auditor",
    icon: <AuditOutlined />,
    permissions: ["admin", "super admin"],
    children: [
      {
        key: "4.1",
        label: "Requerimientos",
        url: "/auditor/requirements",
      },
      {
        key: "4.2",
        label: "Formatos",
        url: "/auditor/formats",
      },
    ],
  },
  {
    key: "5",
    label: "Auditados",
    icon: <AuditOutlined />,
    permissions: ["admin", "super admin"],
    children: [
      {
        key: "5.1",
        label: "Requerimientos",
        url: "/audit/requirements",
      },
      {
        key: "5.2",
        label: "Formatos",
        url: "/audit/formats",
      },
    ],
  },
  {
    key: "9",
    label: "Reportes",
    icon: <FundProjectionScreenOutlined />,
    permissions: ["admin", "super admin"],
    url: "/reports",
  },
];

export const sidebarLogoStyle = {
  height: "32px",
  margin: "16px",
  padding: 5,
  justifyContent: "center",
  background: "rgba(255, 255, 255)",
  borderRadius: "6px",
};

// Helper function to find menu item recursively
export const findMenuItem = (items, key) => {
  for (const item of items) {
    if (item.key === key) return item;
    if (item.children) {
      const found = findMenuItem(item.children, key);
      if (found) return found;
    }
  }
  return null;
};

// Admin only pages atom
export const adminOnlyPagesAtom = atom([
  "/users",
  "/entities",
  "/requirements",
]);
