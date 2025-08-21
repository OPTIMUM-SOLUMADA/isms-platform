import type { Document, Category } from "@/types";
import { users } from "./user"

// Categories mock
const categories: Category[] = [
  { id: "c1", name: "Security Governance", description: "", isoClauseNumber: "A.5.1", documents: [] },
  { id: "c2", name: "Access Management", description: "", isoClauseNumber: "A.9.1", documents: [] },
  { id: "c3", name: "Incident Management", description: "", isoClauseNumber: "A.16.1", documents: [] },
];

// Documents mock
export const documents: Document[] = [
  {
    id: "doc1",
    title: "Information Security Policy",
    category: categories[0],
    categoryId: categories[0].id,
    owner: users[0],
    ownerId: users[0].id,
    status: "APPROVED",
    nextReviewDate: "2025-12-15",
    description: "Policy for company-wide information security",
    fileUrl: "/docs/info-security-policy.pdf",
    reviewFrequency: 12,
    versions: [],
    reviews: [],
    approvals: [],
    notifications: [],
    auditlogs: [],
  },
  {
    id: "doc2",
    title: "Access Control Procedure",
    category: categories[1],
    categoryId: categories[1].id,
    owner: users[2],
    ownerId: users[2].id,
    status: "IN_REVIEW",
    nextReviewDate: "2025-06-10",
    description: "Defines access control mechanisms",
    fileUrl: "/docs/access-control.pdf",
    reviewFrequency: 6,
    versions: [],
    reviews: [],
    approvals: [],
    notifications: [],
    auditlogs: [],
  },
  {
    id: "doc3",
    title: "Incident Response Plan",
    category: categories[2],
    categoryId: categories[2].id,
    owner: users[1],
    ownerId: users[1].id,
    status: "DRAFT",
    nextReviewDate: "2025-03-08",
    description: "Plan to respond to security incidents",
    fileUrl: "/docs/incident-response.pdf",
    reviewFrequency: 12,
    versions: [],
    reviews: [],
    approvals: [],
    notifications: [],
    auditlogs: [],
  },
];
