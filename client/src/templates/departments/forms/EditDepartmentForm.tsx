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

const editDepartmentSchema = z.object({
    id: z.string(),
    name: z.string().nonempty(i18n.t("zod.errors.required")),
    description: z.string().optional(),
});

export type EditDepartmentFormData = z.infer<typeof editDepartmentSchema>;

type EditDepartmentFormProps = CustomFormProps<EditDepartmentFormData> & {
    defaultValues: Partial<EditDepartmentFormData>;
};

const EditDepartmentForm = ({
    defaultValues,
    onSubmit,
    onCancel,
    isPending = false,
    error
}: EditDepartmentFormProps) => {
    const { t } = useTranslation();

    const form = useForm<EditDepartmentFormData>({
        resolver: zodResolver(editDepartmentSchema),
        defaultValues: {
            id: defaultValues.id || "",
            name: defaultValues.name || "",
            description: defaultValues.description || "",
        },
    })

    const {
        handleSubmit,
        reset,
        formState: { isDirty }
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
                            <FormLabel>{t("department.forms.edit.name.label")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("department.forms.edit.name.placeholder")}
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
                            <FormLabel>{t("department.forms.edit.description.label")}</FormLabel>
                            <FormControl>
                                <Textarea placeholder={t("department.forms.edit.description.placeholder")} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {/* Error */}
                <ErrorCodeField code={error} />

                {/* actions */}
                <div className="flex justify-between items-center gap-2 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset(defaultValues)}
                        disabled={!isDirty}
                    >
                        {t('department.forms.edit.actions.reset.label')}
                    </Button>
                    <div className="flex gap-2 items-center">
                        <LoadingButton
                            type="submit"
                            loadingText={t('department.forms.edit.actions.submit.loading')}
                            isLoading={isPending}
                            disabled={!isDirty}
                        >
                            {t('department.forms.edit.actions.submit.label')}
                        </LoadingButton>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                        >
                            {t('department.forms.edit.actions.cancel.label')}
                        </Button>
                    </div>
                </div>

            </form>
        </Form>
    )

}

export default EditDepartmentForm