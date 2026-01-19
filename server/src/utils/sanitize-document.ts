import { DocumentPayload } from '@/services/document.service';

export function sanitizeDocument(doc: DocumentPayload | undefined | null) {
    if (!doc) return {};

    return {
        title: doc.title ?? '',
        description: doc.description ?? '',
        classification: doc.classification ?? '',
        reviewFrequency: doc.reviewFrequency ?? '',
        fileUrl: doc.fileUrl ?? '',
        status: doc.status ?? '',

        type: doc.type?.name ?? '',

        isoClause: doc.isoClause
            ? `${doc.isoClause.code ?? ''} ${doc.isoClause.name ?? ''}`.trim()
            : '',

        authors: Array.isArray(doc.authors) ? doc.authors.map((a: any) => a?.user?.name ?? '') : [],

        reviewers: Array.isArray(doc.reviewers)
            ? doc.reviewers.map((r: any) => r?.user?.name ?? '')
            : [],

        departments: Array.isArray(doc.departmentRoles)
            ? doc.departmentRoles.map((d: any) => d?.departmentRole?.name ?? '')
            : [],

        owner: doc.owner?.name ?? '',
    };
}
