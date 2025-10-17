import { documentReviewService } from "@/services/documentreviewService"
import { DocumentReview } from "@/types"
import { ApiAxiosError } from "@/types/api"
import { useQuery } from "@tanstack/react-query"

export const useFetchPendingReviews = () => {
    return useQuery<DocumentReview[], ApiAxiosError>({
        queryKey: ['pending-reviews'],
        queryFn: async () =>  (await documentReviewService.getPendingReviews()).data
    })
}