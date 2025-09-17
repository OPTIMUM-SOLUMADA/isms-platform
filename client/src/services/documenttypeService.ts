
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { AddDepartmentFormData } from "@/templates/departments/forms/AddDepartmentForm";

const api = API_CONFIG.ENDPOINTS.DOCUMENT_TYPES;

export const documentTypeService = {
    list: async ({ page = 1, limit = 50 }: { page: number; limit: number }) => axios.get(api.BASE, { params: { page, limit } }),
    getById: async (id: string) => axios.get(api.GET(id)),
    create: async (data: AddDepartmentFormData) => axios.post(api.BASE, { ...data }),
    update: async (id: string, data: any) => axios.put(api.UPDATE(id), { ...data }),
    delete: async (id: string) => axios.delete(api.DELETE(id))
}