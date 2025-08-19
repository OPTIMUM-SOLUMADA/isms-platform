import { z } from 'zod';
import { cz } from "@/lib/czod";
import type { CustomFormProps, Department, User } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import i18n from '@/i18n/config';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { roles } from '@/constants/role';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import ErrorCodeField from '@/components/ErrorCodeField';

const updateUserSchema = z.object({
    name: z.string().nonempty(i18n.t("zod.errors.name.required")),
    email: cz.email(),
    role: z.enum(roles),
    departmentId: z.string().nonempty(i18n.t("zod.errors.department.required")),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UpdateUserFormProps extends CustomFormProps<UpdateUserFormData> {
    user: User; // existing user data
    departments: Department[];
}

const UpdateUserForm = ({
    onSubmit,
    user,
    departments = [],
    isPending = false,
    error
}: UpdateUserFormProps) => {

    const { t } = useTranslation();

    const form = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            role: user.role,
            departmentId: user.departmentId,
        },
    });

    const { handleSubmit } = form;

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                {/* name */}
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('user.forms.update.name.label')}</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder={t('user.forms.update.name.placeholder')} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* email */}
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('user.forms.update.email.label')}</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder={t('user.forms.update.email.placeholder')} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* role */}
                <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('user.forms.update.role.label')}</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('user.forms.update.role.placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role, index) => (
                                            <SelectItem key={index} value={role}>
                                                {t(`user.forms.update.role.options.${role.toLowerCase()}`)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* department */}
                <FormField
                    control={form.control}
                    name='departmentId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('user.forms.update.department.label')}</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={t('user.forms.update.department.placeholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((department, index) => (
                                            <SelectItem key={index} value={department.id}>
                                                {department.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                        loadingText={t('user.forms.update.actions.submit.loading')}
                        isLoading={isPending}
                    >
                        {t('user.forms.update.actions.submit.label')}
                    </LoadingButton>
                    <Button type="button" variant="ghost">
                        {t('user.forms.update.actions.cancel.label')}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default UpdateUserForm;
