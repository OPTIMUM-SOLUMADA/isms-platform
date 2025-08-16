import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomFormProps } from "@/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ErrorField from "@/components/ui/error-field";
import { LoadingButton } from "@/components/ui/loading-button";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
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
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "njatotianafiononana@gmail.com",
            password: "njato007",
            rememberMe: false
        },
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
                            <FormLabel>Email Address</FormLabel>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="text"
                                        placeholder="john.smith@company.com"
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
                            <FormLabel>Password</FormLabel>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <FormControl>
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
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
                <ErrorField value={error} />

                {/* Remember Me */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="rememberMe"
                            checked={watch("rememberMe")}
                            onCheckedChange={(checked) => setValue("rememberMe", checked as boolean)}
                        />
                        <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                            Remember me
                        </Label>
                    </div>
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium border-none"
                        onClick={onForgotPassword}
                    >
                        Forgot password?
                    </button>
                </div>

                {/* Submit */}
                <LoadingButton
                    type="submit"
                    className="w-full btn"
                    isLoading={isPending || isSubmitting}
                    loadingText="Signing in..."
                >
                    Sign In
                </LoadingButton>
            </form>
        </Form>
    );
}
