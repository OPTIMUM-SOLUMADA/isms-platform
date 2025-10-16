
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
const api = API_CONFIG.ENDPOINTS.DEPARTMENT_ROLE;

export const depRolepService = {
    getAll: () => axios.get(api.BASE),
    getById: async (id: string) => axios.get(api.GET(id)),
}