export const documentStatus = {
    DRAFT: "DRAFT",
    IN_REVIEW: "IN_REVIEW",
    APPROVED: "APPROVED",
    EXPIRED: "EXPIRED"
} as const;

export const DocumentStatuses = Object.values(documentStatus) as [
    typeof documentStatus.DRAFT,
    typeof documentStatus.IN_REVIEW,
    typeof documentStatus.APPROVED,
    typeof documentStatus.EXPIRED
];