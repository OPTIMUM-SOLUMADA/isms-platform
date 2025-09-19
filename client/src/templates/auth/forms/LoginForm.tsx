import { useState } from "react";
import { z } from "zod";
import { cz } from "@/lib/czod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomFormProps } from "@/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { useTranslation } from "react-i18next";
import ErrorCodeField from "@/components/ErrorCodeField";
import i18n from "@/i18n/config";

const loginSchema = cz.z.object({
    email: cz.email(),
    password: z.string().nonempty(i18n.t("zod.errors.password.required")),
    rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;


interface LoginFormProps extends CustomFormProps<LoginFormData> {
    onForgotPassword?: () => void;
}
export default function LoginForm({
    isPending = false,
    onSubmit,
    onForgotPassword,
    error
}: LoginFormProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "njatotianafiononana@gmail.com",
            password: "Nj@to0012",
            rememberMe: false
        },
        reValidateMode: "onChange"
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        watch,
        setValue,
    } = form;


    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('authentification.login.form.email.label')}</FormLabel>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder={t('authentification.login.form.email.placeholder')}
                                        className="pl-10 h-11"
                                    />
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('authentification.login.form.password.label')}</FormLabel>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <FormControl>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t('authentification.login.form.password.placeholder')}
                                        {...field}
                                        className="pl-10 pr-10 h-11"
                                    />
                                </FormControl>
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Error */}
                <ErrorCodeField code={error} />

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="rememberMe"
                            checked={watch("rememberMe")}
                            onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
                        />
                        <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                            {t('authentification.login.form.rememberMe')}
                        </Label>
                    </div>
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium border-none"
                        onClick={onForgotPassword}
                    >
                        {t('authentification.login.form.forgotPassword')}
                    </button>
                </div>

                {/* Submit */}
                <LoadingButton
                    type="submit"
                    className="w-full btn"
                    isLoading={isPending || isSubmitting}
                    loadingText={t('authentification.login.form.actions.submit.loading')}
                >
                    {t('authentification.login.form.actions.submit.label')}
                </LoadingButton>
            </form>
        </Form>
    );
}
