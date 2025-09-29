import { useMutation } from "@tanstack/react-query";
import AuthService from "@/services/authService";
import type { LoginFormData } from "@/templates/auth/forms/LoginForm";
import type { ApiAxiosError } from "@/types/api";

export const useLogin = () => useMutation({
    mutationFn: (payload: LoginFormData) => AuthService.login({
        email: payload.email,
        password: payload.password,
        rememberMe: payload.rememberMe
    }),
});

export const useLogout = () => useMutation({
    mutationFn: () => AuthService.logout(),
});

export const useVerify = () => useMutation({
    mutationFn: () => AuthService.verify(),
});

export const useChangePassword = () => useMutation<any, ApiAxiosError, { password: string, resetToken: string }>({
    mutationFn: (payload: { password: string, resetToken: string }) => AuthService.changePassword(payload.resetToken, payload.password),
});

export const useResetPassword = () => useMutation<any, ApiAxiosError, { email: string }>({
    mutationFn: (payload: { email: string }) => AuthService.resetPassword(payload.email),
});

export const useVerifyAccount = () => useMutation<any, ApiAxiosError, { token: string }>({
    mutationFn: (payload: { token: string }) => AuthService.verifyAccount(payload.token),
});