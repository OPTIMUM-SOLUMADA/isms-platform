import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CustomFormProps } from "@/types";
import { ArrowLeft, Mail } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ErrorField from "@/components/ui/error-field";
import { LoadingButton } from "@/components/ui/loading-button";

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
                <ErrorField value={error} />

                {/* Submit */}
                <div className="flex items-center justify-between gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="bg-gray-50 btn"
                        onClick={onClickBack}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back
                    </Button>
                    <LoadingButton
                        type="submit"
                        className="btn btn-block"
                        isLoading={isPending || isSubmitting}
                        loadingText="Requesting..."
                    >
                        Request link
                    </LoadingButton>
                </div>
            </form>
        </Form>
    );
}
