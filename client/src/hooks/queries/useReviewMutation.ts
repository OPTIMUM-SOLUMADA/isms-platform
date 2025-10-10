import { documentReviewService } from "@/services/documentreviewService";
import { DocumentReview } from "@/types";
import { ApiAxiosError } from "@/types/api";
import { useQuery } from "@tanstack/react-query";

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