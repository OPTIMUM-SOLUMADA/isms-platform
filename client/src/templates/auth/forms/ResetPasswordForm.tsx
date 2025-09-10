import { useState } from "react";
import { cz } from "@/lib/czod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { CustomFormProps } from "@/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/loading-button";
import ErrorCodeField from "@/components/ErrorCodeField";
import i18n from "@/i18n/config";
import { useTranslation } from "react-i18next";

const resetSchema = cz.z
    .object({
        password: cz.password(),
        confirmPassword: cz.z.string().min(1, i18n.t("zod.errors.confirmPassword.min")),
        keepSignedIn: cz.z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: i18n.t("zod.errors.confirmPassword.matches"),
        path: ["confirmPassword"],
    });

export { resetSchema };

export type ResetFormData = z.infer<typeof resetSchema>;


interface ResetPasswordProps extends CustomFormProps<ResetFormData> {
    onForgotPassword?: () => void;
}
export default function ResetPasswordForm({
    isPending = false,
    onSubmit,
    error,
}: ResetPasswordProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
            keepSignedIn: false
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
        watch,
        setValue
    } = form;


    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("authentification.resetPassword.form.password.label")}</FormLabel>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <FormControl>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t("authentification.resetPassword.form.password.placeholder")}
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

                {/* Password */}
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("authentification.resetPassword.form.confirmPassword.label")}</FormLabel>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <FormControl>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t("authentification.resetPassword.form.confirmPassword.placeholder")}
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

                <div className="flex items-center space-x-2 pb-4">
                    <Checkbox
                        id="keepSignedIn"
                        checked={watch("keepSignedIn")}
                        onCheckedChange={(checked) => setValue("keepSignedIn", checked as boolean)}
                        className="h-5 w-5"
                    />
                    <Label htmlFor="keepSignedIn" className="text-sm text-gray-600">
                        {t("authentification.resetPassword.form.keepSignedIn.label")}
                    </Label>
                </div>

                {/* Submit */}
                <LoadingButton
                    type="submit"
                    className="btn btn-block"
                    isLoading={isPending || isSubmitting}
                    loadingText="Updating password..."
                >
                    {t("authentification.resetPassword.form.actions.submit.label")}
                </LoadingButton>
            </form>
        </Form>
    );
}
