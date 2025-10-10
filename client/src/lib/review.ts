import type { DocumentReview } from "@/types";

export function getReviewStatus(review: DocumentReview): 'APPROVED' | 'IN_REVIEW' | 'EXPIRED' | 'PENDING' {
    if (!review.isCompleted) {
        return "PENDING";
    } else if (review.isCompleted && review.decision === 'APPROVE') {
        return "IN_REVIEW";
    } else if (review.reviewDate && review.reviewDate < new Date()) {
        return "EXPIRED";
    }
    return 'IN_REVIEW'
}