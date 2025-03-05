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
    delivered: false,
  },
  {
    id: "2.1",
    dept: 2,
    name: "Presupuesto de egresos para el ejercicio 2024",
    format: "PDF",
    delivered: true,
  },
  {
    id: "2.2",
    dept: 2,
    name: "Estados financieros mensuales y cortes de caja",
    format: "Excel, PDF",
    delivered: true,
  },
  {
    id: "3.1",
    dept: 3,
    name: "Plantilla de personal autorizada 2024",
    format: "Excel, PDF",
    delivered: true,
  },
  {
    id: "4.1",
    dept: 4,
    name: "Programa anual de adquisiciones",
    format: "Excel, PDF",
    delivered: true,
  },
  {
    id: "5.1",
    dept: 5,
    name: "Expedientes unitarios de obras y acciones",
    format: "PDF",
    delivered: false,
  },
  {
    id: "6.1",
    dept: 6,
    name: "Relación de litigios",
    format: "Excel, PDF",
    delivered: false,
  },
  {
    id: "7.1",
    dept: 7,
    name: "Programa de trabajo 2024",
    format: "PDF",
    delivered: true,
  },
  {
    id: "8.1",
    dept: 8,
    name: "Reportes de evaluación trimestral",
    format: "PDF",
    delivered: true,
  },
]);

// Findings data atom
export const findingsAtom = atom({
  dashboardName: "Hallazgos",
  findings: [
    {
      consecutiveNumber: 1,
      area: "Tesorería",
      observationDate: {
        day: 14,
        month: 2,
        year: 2025,
      },
      observationType: "Control interno",
      observationCode: "Obs. 001",
      observationCategory: "Nueva",
      reviewPeriod: "1er informe",
      sourceDocument: "Conciliaciones bancarias",
      requirementNumber: "2.12",
      description:
        "Cheques y depósitos en transito\nDerivado de la revisión de las conciliaciones bancarias de enero a diciembre, se detectó que existen partidas en conciliación con una antigüedad mayor a un mes, toda vez que, existen tres cheques en circulación en la cuenta contable 1112031700000000 Recaudación 2022 y cuenta bancaria 1174664555, por un importe total de $67,985.93 y dos cheques en circulación en la cuenta contable\n1112031000000000 Rem. de Ingresos Fiscales y cuenta bancaria 0592606321 por un importe total de $13,990.12.",
      legalBasis: [
        "Artículos 42, 43 y 70 fracción I de la Ley General de Contabilidad Gubernamental",
        "359 fracciones IV y V y 367 del Código Hacendario para el Estado ",
        "181 fracción IV, 190, 191 y 193 de la Ley General de Títulos y Operaciones de Crédito",
      ],
      fundingSource: "Ingresos Fiscales",
      observationAmount: 81976.05,
      riskLevel: "Bajo",
      effect: "De control",
      recommendations: [
        "Conforme se realicen sus conciliaciones bancarias verificar la antigüedad de sus cheques y depósitos en tránsito.",
      ],
      actionsToTake: [
        "Investigar si los cheques ya fueron entregados a los beneficiarios o instancias correspondientes y realizar una revisión de hechos posteriores en los estados de cuenta del mes de enero de 2025 para verificar si ya fueron cobrados, en caso contrario ordenar la cancelación de los cheques por reposición de gastos, para realizar la reexpedición de los mismos, citando a los beneficiarios para investigar si el gasto es real y en caso contrario realizar los registros contables correspondientes.",
      ],
      responsible: {
        name: "Lic. Roberto Sánchez Mendoza",
        administrativeUnit: "Tesorería",
      },
      commitmentDate: null,
    },
    {
      consecutiveNumber: 2,
      area: "Tesorería",
      observationDate: {
        day: 14,
        month: 2,
        year: 2025,
      },
      observationType: "Control interno",
      observationCode: "Obs. 002",
      observationCategory: "Nueva",
      reviewPeriod: "1er informe",
      sourceDocument: "XML Recibidos",
      requirementNumber: ["9", "72", "87"],
      description:
        "Proveedores que aparecen en listas del SAT conforme al artículo 69-B\nDerivado de la revisión de las listas publicadas por el SAT de los supuestos del artículo 69-B del CFF, se observó que la autoridad fiscal detectó que existen dos contribuyentes no localizables, por lo que, presumiblemente las operaciones que realizaron con el Municipio los proveedores Benjamín Domínguez Olmos por un importe total de $290,000.00 y Cambio Digital Noticias Multimedios por un monto total de $140,000.00, son inexistentes",
      legalBasis: [
        "Artículos 32-D fracción V, 69 párrafo décimo primero fracción I, II, III, IV y V; y 69-B del Código Federal de la Federación",
        "Resolución Miscelánea Fiscal Regla 1.3.",
      ],
      fundingSource: "Consolidado",
      observationAmount: 430000.0,
      riskLevel: "Alto",
      effect: "De control",
      recommendations: [
        "Verificar la Constancia de Situación Fiscal antes del empadronamiento o renovación del padrón del proveedor.",
      ],
      actionsToTake: [
        "Verificar las fechas de contratación y pagos de los servicios con estos proveedores, así como, de las listas del SAT.",
        'Verificar en los listados que emite el Servicio de Administración Tributaria (SAT) que los proveedores que estén con su domicilio como "No localizado", así como, cuando presenten este supuesto en su Constancia de Situación Fiscal para darse de alta en el padrón de proveedores, no sean dados de alta en el padrón y no se le adjudiquen contratos para la prestación de servicios y venta de bienes al Municipio.',
      ],
      responsible: {
        name: "Lic. Roberto Sánchez Mendoza",
        administrativeUnit: "Tesorería",
      },
      commitmentDate: null,
    },
  ],
});

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
    children: [
      {
        key: "2.1",
        label: "Requerimientos",
        url: "/resume",
      },
      {
        key: "2.2",
        label: "Hallazgos",
        url: "/findings",
      },
    ],
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
