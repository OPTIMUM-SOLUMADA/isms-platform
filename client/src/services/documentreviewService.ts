
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { AddReviewFormData } from "@/templates/forms/Review/AddReviewForm";

const url = API_CONFIG.ENDPOINTS.DOCUMENT_REVIEWS;

export const documentReviewService = {
    list: async () => axios.get(url),
    create: async (data: AddReviewFormData) => axios.post(url, {...data}),
}