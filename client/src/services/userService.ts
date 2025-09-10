
import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import type { AddUserFormData } from "@/templates/users/forms/AddUserForm";
import type { UpdateUserFormData } from "@/templates/users/forms/EditUserForm";

const userUrl = API_CONFIG.ENDPOINTS.USERS;

export const userService = {
    list: async () => axios.get(userUrl),
    create: async (data: AddUserFormData) => axios.post(userUrl, { ...data }),
    getById: async (id: string) => axios.get(`${userUrl}/${id}`),
    update: async (id: string, data: Partial<UpdateUserFormData>) => axios.put(`${userUrl}/${id}`, { ...data }),
    delete: async (id: string) => axios.delete(`${userUrl}/${id}`),
}