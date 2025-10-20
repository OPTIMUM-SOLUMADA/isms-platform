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
    categoryId: categories[0].id,
    owner: users[0],
    ownerId: users[0].id,
    status: "APPROVED",
    nextReviewDate: "2025-12-15",
    description: "Policy for company-wide information security",
    fileUrl: "/docs/info-security-policy.pdf",
    reviewFrequency: "SEMI_ANNUAL",
    versions: [],
    reviews: [],
    approvals: [],
    notifications: [],
    auditlogs: [],
    authors: [{ user: users[0] }],
    classification: "CONFIDENTIAL",
    createdAt: "2023-01-15",
    departmentRoles: [{
      id: "d1",
      departmentRole: {
        id: "dr1",
        name: "Information Security",
        description: "Responsible for information security",
        createdAt: "2023-01-15",
        updatedAt: "2023-01-15",
        departmentMembers: [],
        departmentRoleDocuments: [],
        departmentRoleUsers: [],
        createdBy: users[0],
        departmentId: "dep1",
      }
    }],
    isoClause: {
      id: "iso1",
      code: "A.5.1",
      name: "Information security policy",
      description: "Policy for company-wide information security",
      createdAt: "2023-01-15",
      updatedAt: "2023-01-15",
      documents: [],
    },
    isoClauseId: "iso1",
    department: {
      id: "dep1",
      name: "Information Security",
      description: "Responsible for information security",
      createdAt: "2023-01-15",
      updatedAt: "2023-01-15",
      documents: [],
      roles: [],
      members: [],
    },
    departmentId: "dep1",
    published: true,
    reviewers: [{ user: users[1] }],
    reviewersId: ["2"],
    type: {
      id: "t1",
      name: "Policy",
      description: "Policy for company-wide information security",
      createdAt: "2023-01-15",
      updatedAt: "2023-01-15",
      documents: [],
    },
    updatedAt: "2023-01-15",
    publicationDate: "2023-01-15",
  },
];
