
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { AddDepartmentFormData } from "@/templates/departments/AddDepartmentForm";

const depUrl = API_CONFIG.ENDPOINTS.DEPARTMENTS;

export const depService = {
    list: async () => axios.get(depUrl),
    create: async (data: AddDepartmentFormData) => axios.post(depUrl, data),
    // update: async (userId: string, data: any) => axios.put(`${depUrl}/${userId}`, data),
}