import { z } from 'zod';
import type { CustomFormProps, Department } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import i18n from '@/i18n/config';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import ErrorCodeField from '@/components/ErrorCodeField';

const addReviewSchema = z.object({
    document: z.string().nonempty(i18n.t("zod.errors.documentId.required")),
    reviewer: z.string().nonempty(i18n.t("zod.errors.documentId.required")),
    dueDate: z.string().nonempty(i18n.t("zod.errors.documentId.required")),
    // departmentId: z.string().nonempty(i18n.t("zod.errors.department.required")),
});

export type AddReviewFormData = z.infer<typeof addReviewSchema>;

interface AddReviewFormProps extends CustomFormProps<AddReviewFormData> {
    departments: Department[]
}

const AddUserForm = ({
    onSubmit,
    isPending = false,
    onCancel,
    error
}: AddReviewFormProps) => {

    const { t } = useTranslation();

    const form = useForm<AddReviewFormData>({
        resolver: zodResolver(addReviewSchema),
        defaultValues: {
            document: "",
            dueDate: "",
            reviewer: "",
        },
    });


    const {
        handleSubmit,
    } = form;

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                {/* name */}
                <FormField
                    control={form.control}
                    name='document'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('user.forms.add.name.label')}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={t('user.forms.add.name.placeholder')}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* email */}
                <FormField
                    control={form.control}
                    name='reviewer'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('user.forms.add.email.label')}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder={t('user.forms.add.email.placeholder')}
                                />
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

export default AddUserForm