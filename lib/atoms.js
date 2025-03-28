import { atom } from "jotai";

// Mock data for requirements
const mockRequirements = [
  {
    id: "1",
    refCode: "REQ-001",
    info: "Financial Statement 2023",
    status: "pending",
    dueDate: "2024-03-31",
    requiredFormat: "PDF",
    fileType: "Financial Document",
    history: [
      {
        id: "h1",
        type: "comment",
        user: "John Doe",
        date: "2024-03-20T10:00:00",
        comment: "Please provide the latest financial statement",
      },
    ],
    latestFile: null,
  },
  {
    id: "2",
    refCode: "REQ-002",
    info: "Tax Returns 2023",
    status: "approved",
    dueDate: "2024-03-25",
    requiredFormat: "PDF",
    fileType: "Tax Document",
    history: [
      {
        id: "h2",
        type: "file",
        user: "Jane Smith",
        date: "2024-03-22T14:30:00",
        fileUrl: "/files/tax-returns-2023.pdf",
      },
      {
        id: "h3",
        type: "comment",
        user: "Auditor",
        date: "2024-03-23T09:15:00",
        comment: "Document approved",
      },
    ],
    latestFile: {
      name: "tax-returns-2023.pdf",
      url: "/files/tax-returns-2023.pdf",
    },
  },
  {
    id: "3",
    refCode: "REQ-003",
    info: "Bank Statements Q1 2024",
    status: "missing",
    dueDate: "2024-03-15",
    requiredFormat: "PDF",
    fileType: "Bank Document",
    history: [
      {
        id: "h4",
        type: "comment",
        user: "System",
        date: "2024-03-16T00:00:00",
        comment: "Document overdue",
      },
    ],
    latestFile: null,
  },
];

// Mock data for entities
const mockEntities = [
  {
    id: "1",
    name: "Municipality A",
    description: "Local government entity",
    logo: "/logos/municipality-a.png",
    requirements: mockRequirements,
  },
  {
    id: "2",
    name: "Organization B",
    description: "Non-profit organization",
    logo: "/logos/organization-b.png",
    requirements: mockRequirements.map((req) => ({
      ...req,
      id: `${req.id}-b`,
      status: req.status === "approved" ? "pending" : req.status,
    })),
  },
  {
    id: "3",
    name: "Company C",
    description: "Private corporation",
    logo: "/logos/company-c.png",
    requirements: mockRequirements.map((req) => ({
      ...req,
      id: `${req.id}-c`,
      status: req.status === "missing" ? "approved" : req.status,
    })),
  },
];

export const requirementsAtom = atom(mockRequirements);
export const entitiesAtom = atom(mockEntities);
