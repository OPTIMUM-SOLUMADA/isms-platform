import { API_CONFIG } from "@/configs/api";
import axios from "@/lib/axios";
import { Notification, NotificationListResponse } from "@/types";

const notificationApi = API_CONFIG.ENDPOINTS.NOTIFICATIONS;

type Params = {
  page?: number;
  limit?: number;
  documentId?: string;
};

export const notificationService = {
  list: async ({ page = 1, limit = 20, documentId }: Params = {}) => {
    const params: any = { page, limit };
    if (documentId) params.documentId = documentId;
    
    return axios.get<NotificationListResponse>(notificationApi.BASE, { params });
  },

  getById: async (id: string) => {
    return axios.get<Notification>(notificationApi.GET(id));
  },

  markAsRead: async (id: string) => {
    return axios.post<Notification>(notificationApi.MARK_READ(id));
  },

  markAllAsRead: async () => {
    return axios.post(notificationApi.MARK_ALL_READ);
  },

  delete: async (id: string) => {
    return axios.delete(notificationApi.DELETE(id));
  },

  getByDocument: async (documentId: string) => {
    return axios.get<NotificationListResponse>(notificationApi.BASE, {
      params: { documentId },
    });
  },
};
