
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const docApi = API_CONFIG.ENDPOINTS.DOCUMENTS;

type Params = {
    page?: number;
    limit?: number;
}

export const documentService = {
    list: async ({ page = 1, limit = 50 }: Params) => axios.get(docApi.BASE, { params: { page, limit } }),
    getStats: async () => axios.get(docApi.STATS),
    getById: async (id: string) => axios.get(docApi.GET(id)),
    create: async (data: FormData) => axios.post(docApi.BASE, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }),
    update: async (id: string, data: FormData) => axios.put(docApi.GET(id), data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }),
    delete: async (id: string) => axios.delete(docApi.GET(id)),
    download: async (id: string) => axios.get(docApi.DOWNLOAD(id), {
        responseType: "blob"
    }),
    publish: async (id: string) => axios.put(docApi.PUBLISH(id)),
    unpublish: async (id: string) => axios.put(docApi.UNPUBLISH(id)),
    createDraftVersion: async (id: string) => axios.get(docApi.CREATE_DRAFT_VERSION(id)),
    getPublished: async (userId: string) => axios.get(docApi.GET_PUBLISHED(userId)),
    addToRecenlyViewed: async (userId: string, documentId: string) => axios.post(docApi.ADD_TO_RECENTLY_VIEWED(userId, documentId)),
    getRecenlyViewed: async (userId: string) => axios.get(docApi.GET_RECENTLY_VIEWED(userId)),
};