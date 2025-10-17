
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { AddDepartmentFormData } from "@/templates/departments/forms/AddDepartmentForm";
import { AddDepartmentRoleFormData } from "@/templates/departments/forms/AddDepartmentRoleForm";
import { PaginationArgs } from "@/types/pagination";

const api = API_CONFIG.ENDPOINTS.DEPARTMENTS;

export const depService = {
    list: async ({ limit, page }: PaginationArgs) => axios.get(api.BASE, {
        params: { page, limit }
    }),
    getAll: () => axios.get(api.BASE, { params: { page: 1, limit: 1000 } }),
    getById: async (id: string) => axios.get(api.GET(id)),
    create: async (data: AddDepartmentFormData) => axios.post(api.BASE, data),
    update: async (userId: string, data: any) => axios.put(api.GET(userId), data),
    delete: async (userId: string) => axios.delete(api.GET(userId)),
    search: async (query: string) => axios.get(api.SEARCH, { params: { q: query } }),

    getRoles: async (id: string) => axios.get(api.GET_ROLES(id)),
    getRoleById: async (id: string) => axios.get(api.GET_ROLE_BY_ID(id)),
    createRole: async (id: string, data: AddDepartmentRoleFormData) => axios.post(api.GET_ROLES(id), data),
    updateRoles: async (id: string, data: any) => axios.put(api.GET_ROLES(id), { roles: data }),
    deleteRoles: async (id: string) => axios.delete(api.GET_ROLES(id)),
    searchRole: async (query: string) => axios.get(api.SEARCH_ROLES, { params: { q: query } }),
}