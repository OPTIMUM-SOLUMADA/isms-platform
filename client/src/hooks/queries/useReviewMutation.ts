import { documentReviewService } from "@/services/documentreviewService";
import { DocumentReview, ReviewDecision } from "@/types";
import { ApiAxiosError } from "@/types/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useFetchReviews = () => {
    return useQuery<DocumentReview[], ApiAxiosError>({
        queryKey: ['reviews'],
        queryFn: async () => (await documentReviewService.list()).data,
        staleTime: 1000 * 60 * 1,
        refetchInterval: 15000
    });
};

export const useGetReview = (id: string | undefined) => useQuery<DocumentReview, ApiAxiosError>({
    queryKey: ['reviews', id],
    queryFn: async () => (await documentReviewService.findById(id!)).data,
    staleTime: 1000 * 60 * 1,
    enabled: !!id
});

export const useSubmitReview = (id: string | undefined) => useMutation<any, ApiAxiosError, { decision: ReviewDecision, comment: string }>({
    mutationFn: async (payload) => documentReviewService.submitReview(id!, payload),
});