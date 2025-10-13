import type { DocumentReview } from "@/types";

export function getReviewStatus(review: DocumentReview): 'APPROVED' | 'IN_REVIEW' | 'EXPIRED' | 'PENDING' | 'REJECTED' {
    if (review.decision === 'APPROVE') {
        return "APPROVED";
    } else if (review.decision === 'REJECT') {
        return 'REJECTED';
    } else if (review.reviewDate && review.reviewDate < new Date()) {
        return "EXPIRED";
    }
    return 'PENDING'
}