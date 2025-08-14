import { API_CONFIG as API } from "@/configs/api";
import axios from "@/lib/axios";

const AuthService = {
    login: async (email: string, password: string) => {
        return axios.post(API.ENDPOINTS.AUTH.LOGIN, { email, password });
    },
    logout: async () => {
        return axios.post(API.ENDPOINTS.AUTH.LOGOUT);
    },
    refreshToken: async () => {
        return axios.post(API.ENDPOINTS.AUTH.REFRESH);
    },
    verify: async () => {
        return axios.post(API.ENDPOINTS.AUTH.VERIFY);
    },
    resetPassword: async (email: string) => {
        return axios.post(API.ENDPOINTS.AUTH.RESET_PASSWORD, { email });
    },
    changePassword: async (resetToken: string, password: string) => {
        return axios.post(API.ENDPOINTS.AUTH.CHANGE_PASSWORD, { resetToken, password });
    },
}

export default AuthService;