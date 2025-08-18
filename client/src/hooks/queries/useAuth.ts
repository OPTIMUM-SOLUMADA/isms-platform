import { useMutation } from "@tanstack/react-query";
import AuthService from "@/services/authService";
import type { LoginFormData } from "@/templates/forms/LoginForm";
import type { ApiAxiosError } from "@/types/api";

export const useLogin = () => useMutation({
    mutationFn: (payload: LoginFormData) => AuthService.login(payload.email, payload.password),
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
