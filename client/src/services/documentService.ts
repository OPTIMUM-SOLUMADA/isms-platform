
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const url = API_CONFIG.ENDPOINTS.DOCUMENTS;

export const documentService = {
    list: async () => axios.get(url),
    create: async (data: FormData) => axios.post(url, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }),
    update: async (id: string, data: FormData) => axios.put(`${url}/${id}`, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }),
    delete: async (id: string) => axios.delete(`${url}/${id}`),
}