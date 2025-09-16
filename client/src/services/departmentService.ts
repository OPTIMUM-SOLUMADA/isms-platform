
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { AddDepartmentFormData } from "@/templates/departments/forms/AddDepartmentForm";

const api = API_CONFIG.ENDPOINTS.DEPARTMENTS;

export const depService = {
    list: async () => axios.get(api.BASE),
    create: async (data: AddDepartmentFormData) => axios.post(api.BASE, data),
    update: async (userId: string, data: any) => axios.put(api.GET(userId), data),
    delete: async (userId: string) => axios.delete(api.GET(userId)),
}