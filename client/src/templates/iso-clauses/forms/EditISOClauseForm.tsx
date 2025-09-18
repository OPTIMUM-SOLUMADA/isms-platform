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

const schema = z.object({
    id: z.string(),
    userId: z.string().optional(),
    code: z.string().nonempty(i18n.t("zod.errors.required")),
    name: z.string().nonempty(i18n.t("zod.errors.required")),
    description: z.string().optional(),
});

export type EditISOClauseFormData = z.infer<typeof schema>;

type EditISOClauseFormProps = CustomFormProps<EditISOClauseFormData> & {
    userId?: string;
    defaultValue: Partial<EditISOClauseFormData>;
};

const EditISOClauseForm = ({
    defaultValue,
    onSubmit,
    onCancel,
    isPending = false,
    userId,
    error
}: EditISOClauseFormProps) => {
    const { t } = useTranslation();

    const form = useForm<EditISOClauseFormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            userId,
            id: defaultValue.id,
            code: defaultValue.code,
            name: defaultValue.name,
            description: defaultValue.description,
        },
    })

    const {
        handleSubmit,
        formState: { isDirty },
        reset
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
                            <FormLabel>{t("isoClause.forms.edit.name.label")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("isoClause.forms.edit.name.placeholder")}
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
                {/* name */}
                <FormField
                    control={form.control}
                    name='code'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("isoClause.forms.edit.code.label")}</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder={t("isoClause.forms.edit.code.placeholder")}
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
                            <FormLabel>{t("isoClause.forms.edit.description.label")}</FormLabel>
                            <FormControl>
                                <Textarea placeholder={t("isoClause.forms.edit.description.placeholder")} {...field} />
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
                        onClick={() => reset(defaultValue)}
                        disabled={!isDirty}
                    >
                        {t('isoClause.forms.edit.actions.reset.label')}
                    </Button>
                    <div className="flex gap-2 items-center">
                        <LoadingButton
                            type="submit"
                            loadingText={t('isoClause.forms.edit.actions.submit.loading')}
                            isLoading={isPending}
                            disabled={!isDirty}
                        >
                            {t('isoClause.forms.edit.actions.submit.label')}
                        </LoadingButton>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                        >
                            {t('isoClause.forms.edit.actions.cancel.label')}
                        </Button>
                    </div>
                </div>

            </form>
        </Form>
    )

}

export default EditISOClauseForm