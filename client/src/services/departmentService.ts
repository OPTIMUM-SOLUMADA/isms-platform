
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { AddDepartmentFormData } from "@/templates/departments/forms/AddDepartmentForm";
import { PaginationArgs } from "@/types/pagination";

const api = API_CONFIG.ENDPOINTS.DEPARTMENTS;

export const depService = {
    list: async ({ limit, page }: PaginationArgs) => axios.get(api.BASE, {
        params: { page, limit }
    }),
    create: async (data: AddDepartmentFormData) => axios.post(api.BASE, data),
    update: async (userId: string, data: any) => axios.put(api.GET(userId), data),
    delete: async (userId: string) => axios.delete(api.GET(userId)),
    search: async (query: string) => axios.get(api.SEARCH, { params: { q: query } }),
}