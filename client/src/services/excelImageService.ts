
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const url = API_CONFIG.ENDPOINTS.EXCEL_IMAGE;

export const excelImageService = {
    get: async (filename: string) => axios.get(url, {
        params: { filename },
    }),
}