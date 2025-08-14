import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomFormProps } from "@/types";
import { ArrowLeft, Mail } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const passwordSchema = z.object({
    email: z.string().email("Please enter a valid email address")
});

export type ForgotPasswordFormData = z.infer<typeof passwordSchema>;


interface ForgotPasswrodFormProps extends CustomFormProps<ForgotPasswordFormData> {
    onClickBack?: () => void
}
export default function ForgotPasswordPage({
    isPending = false,
    onClickBack,
    onSubmit,
    error,
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

                {/* Error */}
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                {/* Submit */}
                <div className="flex items-center justify-between gap-2">
                    <Button
                        type="button"
                        className="w-fit h-11 text-slate-800 font-medium bg-gray-200 hover:bg-gray-300 border border-gray-300"
                        onClick={onClickBack}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <Button
                        type="submit"
                        className="w-full h-11  text-white font-medium bg-green-600 hover:bg-green-700"
                        disabled={isPending || isSubmitting}
                    >
                        {isPending || isSubmitting ? (
                            <div className="flex items-center space-x-2 ">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Requesting...</span>
                            </div>
                        ) : (
                            "Request link"
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
