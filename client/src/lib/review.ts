import { isBefore } from "date-fns"
import type { DocumentReview } from "@/types"

export function getReviewStatus(
    review: DocumentReview
): 'APPROVED' | 'IN_REVIEW' | 'EXPIRED' | 'PENDING' | 'REJECTED' {

    if (review.decision === 'APPROVE') {
        return "APPROVED"
    }

    if (review.decision === 'REJECT') {
        return "REJECTED"
    }

    if (review.reviewDate && isBefore(new Date(review.reviewDate), new Date())) {
        return "EXPIRED"
    }

    return "PENDING"
}