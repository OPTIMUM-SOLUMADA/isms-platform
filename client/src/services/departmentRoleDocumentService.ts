import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const api = API_CONFIG.ENDPOINTS.DEPARTMENT_ROLE_DOCUMENTS;

export const departmentRoleDocumentService = {
    getAll: () => axios.get(api.BASE),
};