import i18n from "@/i18n/config";
import { CustomFormProps } from "@/types";
import z from "zod";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorCodeField from "@/components/ErrorCodeField";
import { LoadingButton } from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const addDepartmentSchema = z.object({
    userId: z.string().optional(),
    name: z.string().nonempty(i18n.t("zod.errors.required")),
    description: z.string().optional(),
});

export type AddDepartmentFormData = z.infer<typeof addDepartmentSchema>;

type AddDepartmentFormProps = CustomFormProps<AddDepartmentFormData> & {
    userId?: string;
};

const AddDepartmentForm = ({
    onSubmit,
    onCancel,
    isPending = false,
    userId,
    error
}: AddDepartmentFormProps) => {
    const { t } = useTranslation();

    const form = useForm<AddDepartmentFormData>({
        resolver: zodResolver(addDepartmentSchema),
        defaultValues: {
            userId: userId,
            name: "",
            description: "",
        },
    })

    const {
        handleSubmit
    } = form;

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                {/* name */}
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("department.forms.add.name.label")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("department.forms.add.name.placeholder")}
                                    {...field}
                                    type="text"
                                    className="border rounded-lg px-3 py-2 w-full"
                                    hasError={!!error}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* description */}
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("department.forms.add.description.label")}</FormLabel>
                            <FormControl>
                                <Textarea placeholder={t("department.forms.add.description.placeholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Error */}
                <ErrorCodeField code={error} />

                {/* actions */}
                <div className="flex justify-end items-center gap-2 mt-6">
                    <LoadingButton
                        type="submit"
                        loadingText={t('user.forms.add.actions.submit.loading')}
                        isLoading={isPending}
                    >
                        {t('user.forms.add.actions.submit.label')}
                    </LoadingButton>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                    >
                        {t('user.forms.add.actions.cancel.label')}
                    </Button>
                </div>

            </form>
        </Form>
    )

}

export default AddDepartmentForm