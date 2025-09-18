
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const api = API_CONFIG.ENDPOINTS.ISO_CLAUSES;

export const isoClauseService = {
    list: async ({ page = 1, limit = 50 }: { page: number; limit: number }) => axios.get(api.BASE, { params: { page, limit } }),
    getById: async (id: string) => axios.get(api.GET(id)),
    create: async (data: any) => axios.post(api.BASE, data),
    update: async (id: string, data: any) => axios.put(api.GET(id), data),
    delete: async (id: string) => axios.delete(api.GET(id))
}