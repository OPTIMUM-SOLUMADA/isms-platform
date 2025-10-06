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

const editDepartmentRoleSchema = z.object({
    id: z.string(),
    userId: z.string().optional(),
    name: z.string().nonempty(i18n.t("zod.errors.required")),
    description: z.string().optional(),
});

export type EditDepartmentRoleFormData = z.infer<typeof editDepartmentRoleSchema>;

type EditDepartmentRoleFormProps = CustomFormProps<EditDepartmentRoleFormData> & {
    defaultValues: Partial<EditDepartmentRoleFormData>;
    userId?: string;
};

const EditDepartmentRoleForm = ({
    defaultValues,
    onSubmit,
    onCancel,
    isPending = false,
    userId,
    error
}: EditDepartmentRoleFormProps) => {
    const { t } = useTranslation();

    const form = useForm<EditDepartmentRoleFormData>({
        resolver: zodResolver(editDepartmentRoleSchema),
        defaultValues: {
            id: defaultValues.id,
            userId: userId,
            name: defaultValues.name,
            description: defaultValues.description,
        },
    });

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
                            <FormLabel>{t("departmentRole.forms.edit.name.label")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("departmentRole.forms.edit.name.placeholder")}
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
                            <FormLabel>{t("departmentRole.forms.edit.description.label")}</FormLabel>
                            <FormControl>
                                <Textarea placeholder={t("departmentRole.forms.edit.description.placeholder")} {...field} />
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
                        {t('departmentRole.forms.edit.actions.reset.label')}
                    </Button>
                    <div className="flex gap-2 items-center">
                        <LoadingButton
                            type="submit"
                            loadingText={t('departmentRole.forms.edit.actions.submit.loading')}
                            isLoading={isPending}
                            disabled={!isDirty}
                        >
                            {t('departmentRole.forms.edit.actions.submit.label')}
                        </LoadingButton>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                        >
                            {t('departmentRole.forms.edit.actions.cancel.label')}
                        </Button>
                    </div>
                </div>

            </form>
        </Form>
    )

}

export default EditDepartmentRoleForm