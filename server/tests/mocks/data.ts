import { User, Department, Document, DocumentStatus, DocumentType } from '@prisma/client';

export const mockUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'l6qWZ@example.com',
  role: 'ADMIN',
  passwordHash: '$2a$12$TdKuhroGhJ/DjVLDAQp2ouUebXx5S8bG0MYLR32uFzmiMPDq6a32m',
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
  lastLogin: new Date(),
  departmentId: '1',
  metadata: {},
  passwordResetToken: ""
};

export type DepartmentWithMembers = Department & { members: User[] };

// Departments mock
export const departments: DepartmentWithMembers =
{
  id: "d1", name: "Information Security", description: "", members: [mockUser],
  createdAt: new Date("2023-01-01"), updatedAt: new Date("2023-01-01")
};

// Categories mock
const category: DocumentType =
  { id: "c1", name: "Security Governance", description: "", updatedAt: new Date("2023-01-01"), createdAt: new Date("2023-01-01") };

// Documents mock
export const document: Document =
{
  id: "doc1",
  title: "Information Security Policy",
  status: DocumentStatus.APPROVED,
  nextReviewDate: new Date("2025-12-15"),
  description: "Policy for company-wide information security",
  fileUrl: "/uploads/test-file.pdf",
  reviewFrequency: 12,
  departmentId: "",
  isoClauseId: "",
  reviewersId: [],

  ownerId: mockUser.id,
  categoryId: category?.id ?? null,

  createdAt: new Date(),
  updatedAt: new Date(),
};
