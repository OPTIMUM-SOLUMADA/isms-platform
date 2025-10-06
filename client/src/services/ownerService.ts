
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { RoleType } from "@/types";

const api = API_CONFIG.ENDPOINTS.OWNERS;

export type Pagination = {
    page?: number;
    limit?: number;
};

type FetchFilter = {
    isActive?: boolean;
    role?: RoleType;
} & Pagination;

export const ownerService = {
    list: async (filter?: FetchFilter) => axios.get(
        api.BASE, {
        params: {
            page: filter?.page || 1,
            limit: filter?.limit || 10,
            isActive: filter?.isActive,
            role: filter?.role
        }
    }
    ),
}