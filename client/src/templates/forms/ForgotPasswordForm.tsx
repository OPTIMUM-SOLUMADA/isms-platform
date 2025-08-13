import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomFormProps } from "@/types";
import { Mail } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const passwordSchema = z.object({
    email: z.string().email("Please enter a valid email address")
});

export type ForgotPasswordFormData = z.infer<typeof passwordSchema>;


interface ForgotPasswrodFormProps extends CustomFormProps<ForgotPasswordFormData> {
    onForgotPassword?: () => void;
}
export default function ForgotPasswordPage({
    isPending = false,
    onSubmit,
}: ForgotPasswrodFormProps) {

    const form = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            email: "",
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
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

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full h-11  text-white font-medium bg-green-600 hover:bg-green-700"
                    disabled={isPending || isSubmitting}
                >
                    {isPending || isSubmitting ? (
                        <div className="flex items-center space-x-2 ">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Signing in...</span>
                        </div>
                    ) : (
                        "Reset"
                    )}
                </Button>
            </form>
        </Form>
    );
}
