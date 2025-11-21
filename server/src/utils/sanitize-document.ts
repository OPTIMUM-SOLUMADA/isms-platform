import { DocumentPayload } from '@/services/document.service';

export function sanitizeDocument(user: DocumentPayload) {
    const {
        title,
        description,
        type,
        classification,
        isoClause,
        owner,
        reviewFrequency,
        authors,
        reviewers,
        departmentRoles,
        fileUrl,
    } = user;

    return {
        title,
        description,
        classification,
        reviewFrequency,
        fileUrl,
        type: type?.name,
        isoClause: `${isoClause.code} ${isoClause.name}`,
        authors: authors.map((author: any) => author.user?.name),
        reviewers: reviewers.map((rev: any) => rev.user?.name),
        departments: departmentRoles.map((dept: any) => dept.departmentRole?.name),
        owner: owner.name,
    };
}
