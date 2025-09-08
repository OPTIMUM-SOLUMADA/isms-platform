
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { AddReviewFormData } from "@/templates/forms/reviews/AddReviewForm";

const url = API_CONFIG.ENDPOINTS.DOCUMENTS.REVIEWS;

export const documentReviewService = {
    list: async () => axios.get(url),
    create: async (data: AddReviewFormData) => axios.post(url, {...data}),
    updateComment: async (id: string, comment: string) => axios.put(`${url}/${id}`, { comment }),
}