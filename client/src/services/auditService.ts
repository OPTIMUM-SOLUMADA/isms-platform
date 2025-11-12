import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";

const api = API_CONFIG.ENDPOINTS.AUDIT;

type GetParams = {
    startDate: string;
    endDate: string;
};

export const AuditService = {
    getAll: (params?: GetParams) =>
        axios.get(api.BASE, {
            params: {
                ...(params && params),
            },
        }),
    getStats: () => axios.get(api.STATS),
};
