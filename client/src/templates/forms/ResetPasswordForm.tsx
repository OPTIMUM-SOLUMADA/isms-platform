import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomFormProps } from "@/types";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const resetSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).*$/,
                "Password must contain uppercase, lowercase, number, and special character"
            ),
        confirmPassword: z.string().min(1, "Please confirm your password"),
        keepSignedIn: z.boolean().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
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

                {/* Password */}
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
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
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                <div className="flex items-center space-x-2 pb-4">
                    <Checkbox
                        id="keepSignedIn"
                        checked={watch("keepSignedIn")}
                        onCheckedChange={(checked) => setValue("keepSignedIn", checked as boolean)}
                        className="h-5 w-5"
                    />
                    <Label htmlFor="keepSignedIn" className="text-sm text-gray-600">
                        Keep me signed in
                    </Label>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full h-11  text-white font-medium bg-green-600 hover:bg-green-700"
                    disabled={isPending || isSubmitting}
                >
                    {isPending || isSubmitting ? (
                        <div className="flex items-center space-x-2 ">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Updating password...</span>
                        </div>
                    ) : (
                        "Submit"
                    )}
                </Button>
            </form>
        </Form>
    );
}
