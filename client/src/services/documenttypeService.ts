
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { AddDepartmentFormData } from "@/templates/departments/AddDepartmentForm";

const url = API_CONFIG.ENDPOINTS.DOCUMENT_TYPES;

export const documentTypeService = {
    list: async () => axios.get(url),
    create: async (data: AddDepartmentFormData) => axios.post(url, { ...data }),
}