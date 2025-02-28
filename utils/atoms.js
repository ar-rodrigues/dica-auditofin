import { atom, useAtom } from "jotai";
import LogoWhite from "@/public/images/logo-blanco-300x200.png";
import Logo from "@/public/images/logo-300x200.png";
import Office from "@/public/images/content/office.png";
import Team from "@/public/images/content/team.jpg";
import Team2 from "@/public/images/content/team2.jpg";
import Team3 from "@/public/images/content/team3.jpg";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";

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

// Content images atoms
export const imageAtoms = {
  hero: {
    office: atom(Office),
    team: atom(Team),
    teamConsulting: atom(Team2),
    teamSupport: atom(Team3),
  },
};

// Carousel content atom
export const carouselContentAtom = atom([
  {
    title: "Soluciones Tecnológicas Avanzadas",
    description:
      "Impulsamos la transformación digital de tu empresa con innovación y eficiencia",
    bgColor: "from-primary/90 to-primary/60",
    image: Office,
    buttonText: "Explorar Soluciones",
  },
  {
    title: "Auditoría Profesional Integral",
    description:
      "Evaluaciones exhaustivas y recomendaciones estratégicas para tu negocio",
    bgColor: "from-primary/90 to-primary/60",
    image: Team,
    buttonText: "Conocer Servicios",
  },
  {
    title: "Consultoría Empresarial Experta",
    description: "Asesoramiento estratégico respaldado por años de experiencia",
    bgColor: "from-primary/90 to-primary/60",
    image: Team2,
    buttonText: "Consultar Ahora",
  },
  {
    title: "Soporte Técnico Especializado",
    description:
      "Asistencia continua y soluciones inmediatas para tu infraestructura",
    bgColor: "from-primary/90 to-primary/60",
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

export const departmentsAtom = atom({
  "SECRETARÍA DEL AYUNTAMIENTO": 1,
  TESORERÍA: 2,
  "DIRECCIÓN DE RECURSOS HUMANOS": 3,
  "DIRECCIÓN DE ADMINISTRACIÓN": 4,
  "DIRECCIÓN DE OBRAS PÚBLICAS": 5,
  "DIRECCIÓN DE ASUNTOS JURÍDICOS": 6,
  CONTRALORÍA: 7,
  "GOBIERNO ABIERTO": 8,
});

export const requirementsAtom = atom([
  {
    id: "1.1",
    dept: 1,
    name: "Relación de actas de Sesión de Cabildo",
    format: "Excel",
    certified: false,
    original: true,
  },
  {
    id: "2.1",
    dept: 2,
    name: "Presupuesto de egresos para el ejercicio 2024",
    format: "PDF",
    certified: true,
  },
  {
    id: "2.2",
    dept: 2,
    name: "Estados financieros mensuales y cortes de caja",
    format: "Excel, PDF",
    certified: true,
  },
  {
    id: "3.1",
    dept: 3,
    name: "Plantilla de personal autorizada 2024",
    format: "Excel, PDF",
    certified: true,
  },
  {
    id: "4.1",
    dept: 4,
    name: "Programa anual de adquisiciones",
    format: "Excel, PDF",
    certified: true,
  },
  {
    id: "5.1",
    dept: 5,
    name: "Expedientes unitarios de obras y acciones",
    format: "PDF",
    certified: false,
    original: true,
  },
  {
    id: "6.1",
    dept: 6,
    name: "Relación de litigios",
    format: "Excel, PDF",
    certified: false,
    original: true,
  },
  {
    id: "7.1",
    dept: 7,
    name: "Programa de trabajo 2024",
    format: "PDF",
    certified: true,
  },
  {
    id: "8.1",
    dept: 8,
    name: "Reportes de evaluación trimestral",
    format: "PDF",
    certified: true,
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
  },
  {
    key: "2",
    label: "Resumen",
    icon: <DesktopOutlined />,
    url: "/resume",
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
