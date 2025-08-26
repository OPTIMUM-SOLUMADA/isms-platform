
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const url = API_CONFIG.ENDPOINTS.DOCUMENT_TYPES;

export const documentTypeService = {
    list: async () => axios.get(url),
}