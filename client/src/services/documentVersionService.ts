
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const api = API_CONFIG.ENDPOINTS.DOCUMENT_VERSIONS;

export const documentVersionService = {
    list: async ({ page = 1, limit = 50 }: { page: number; limit: number }) => axios.get(api.BASE, { params: { page, limit } }),
    getByDocument: async (id: string) => axios.get(api.GET_BY_DOCUMENT(id)),
    download: async (id: string) => axios.get(api.DOWNLOAD(id), { responseType: "blob" }),
}