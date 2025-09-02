
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const url = API_CONFIG.ENDPOINTS.DOCUMENTS;
const statsUrl = API_CONFIG.ENDPOINTS.DOCUMENTS_STATS;
const downloadUrl = API_CONFIG.ENDPOINTS.DOCUMENTS_DOWNLOAD;

type Params = {
    page?: number;
    limit?: number;
}

export const documentService = {
    list: async ({ page = 1, limit = 50 }: Params) => axios.get(url, { params: { page, limit } }),
    getStats: async () => axios.get(statsUrl),
    getById: async (id: string) => axios.get(`${url}/${id}`),
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
    download: async (id: string) => axios.get(`${downloadUrl}/${id}`, {
        responseType: "blob"
    }),
};