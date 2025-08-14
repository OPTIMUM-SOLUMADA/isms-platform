import { useMutation } from "@tanstack/react-query";
import AuthService from "@/services/authService";
import type { LoginFormData } from "@/templates/forms/LoginForm";

export const useLogin = () => useMutation({
    mutationFn: (payload: LoginFormData) => AuthService.login(payload.email, payload.password),
});

export const useLogout = () => useMutation({
    mutationFn: () => AuthService.logout(),
});

export const useVerify = () => useMutation({
    mutationFn: () => AuthService.verify(),
});
