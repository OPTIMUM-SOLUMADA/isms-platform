
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { AddReviewFormData } from "@/templates/reviews/forms/AddReviewForm";
import { ReviewDecision } from "@/types";

const api = API_CONFIG.ENDPOINTS.REVIEWS;

export const documentReviewService = {
    list: async () => axios.get(api.BASE),
    getMyReviews: async (id: string, filter: { page: number; limit: number, status: string }) => axios.get(api.GET_MY_REVIEWS(id), {
        params: { page: filter.page, limit: filter.limit, status: filter.status },
    }),
    getMyReviewsStats: async (id: string) => axios.get(api.GET_MY_REVIEWS_STATS(id)),
    findById: async (id: string) => axios.get(api.GET(id)),
    create: async (data: AddReviewFormData) => axios.post(api.BASE, { ...data }),
    updateComment: async (id: string, comment: string) => axios.put(api.GET(id), { comment }),
    submitReview: async (id: string, data: { decision: ReviewDecision; comment: string }) => axios.put(api.MAKE_DECISION(id), data),
    getPendingReviews: async () => axios.get(api.GET_PENDING_REVIEWS),
    markAsCompleted: async (id: string) => axios.patch(api.MARK_AS_COMPLETED(id)),
};