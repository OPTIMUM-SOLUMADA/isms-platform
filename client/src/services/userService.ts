
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import type { AddUserFormData } from "@/templates/users/forms/AddUserForm";
import type { UpdateUserFormData } from "@/templates/users/forms/EditUserForm";
import { RoleType } from "@/types";

const api = API_CONFIG.ENDPOINTS.USERS;

export type UserPagination = {
    page?: number;
    limit?: number;
};

type FetchFilter = {
    isActive?: boolean;
    role?: RoleType;
} & UserPagination;

export const userService = {
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
    create: async (data: AddUserFormData) => axios.post(api.BASE, { ...data }),
    getById: async (id: string) => axios.get(api.GET(id)),
    update: async (id: string, data: Partial<UpdateUserFormData>) => axios.put(api.UPDATE(id), { ...data }),
    delete: async (id: string) => axios.delete(api.DELETE(id)),
    sendInvitation: async (id: string) => axios.post(api.INVITE(id)),
    activate: async (id: string) => axios.patch(api.ACTIVATE(id)),
    deactivate: async (id: string) => axios.patch(api.DEACTIVATE(id)),
    search: async (q: string) => axios.get(api.SEARCH, { params: { q } }),
    getUserByIds: async (ids: string[]) => axios.get(api.GET_USER_BY_IDS, { params: { ids: ids.join(',') } }),
    getUserRolesStats: async () => axios.get(api.USER_ROLES_STATS),
}