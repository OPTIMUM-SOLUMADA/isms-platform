import { API_CONFIG as API } from "@/configs/api";
import axios from "@/lib/axios";

const AuthService = {
    login: async ({ email, password, rememberMe = false }: { email: string, password: string, rememberMe?: boolean }) => {
        return axios.post(API.ENDPOINTS.AUTH.LOGIN, { email, password, rememberMe });
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
        return axios.patch(API.ENDPOINTS.AUTH.CHANGE_PASSWORD, { resetToken, password });
    },
    verifyResetToken: async (resetToken: string) => {
        return axios.post(API.ENDPOINTS.AUTH.VERIFY_RESET_TOKEN, { resetToken });
    },
}

export default AuthService;