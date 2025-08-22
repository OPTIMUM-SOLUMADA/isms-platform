
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const url = API_CONFIG.ENDPOINTS.ISO_CLAUSES;

export const isoClauseService = {
    list: async () => axios.get(url),
}