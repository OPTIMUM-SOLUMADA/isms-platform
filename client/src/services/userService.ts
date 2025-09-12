
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import type { AddUserFormData } from "@/templates/users/forms/AddUserForm";
import type { UpdateUserFormData } from "@/templates/users/forms/EditUserForm";

const api = API_CONFIG.ENDPOINTS.USERS;

export const userService = {
    list: async () => axios.get(api.BASE),
    create: async (data: AddUserFormData) => axios.post(api.BASE, { ...data }),
    getById: async (id: string) => axios.get(api.GET(id)),
    update: async (id: string, data: Partial<UpdateUserFormData>) => axios.put(api.UPDATE(id), { ...data }),
    delete: async (id: string) => axios.delete(api.DELETE(id)),
    sendInvitation: async (id: string) => axios.post(api.INVITE(id)),
    activate: async (id: string) => axios.patch(api.ACTIVATE(id)),
    deactivate: async (id: string) => axios.patch(api.DEACTIVATE(id)),
}