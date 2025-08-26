
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const depUrl = API_CONFIG.ENDPOINTS.DEPARTMENTS;

export const depService = {
    list: async () => axios.get(depUrl),
    // create: async () => axios.post(depUrl),
    // update: async (userId: string, data: any) => axios.put(`${depUrl}/${userId}`, data),
}