
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const depUrl = API_CONFIG.ENDPOINTS.DEPARTMENTS;

export const depService = {
    list: async () => axios.get(depUrl),
}