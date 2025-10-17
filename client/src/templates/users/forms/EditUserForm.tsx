import { z } from 'zod';
import { cz } from "@/lib/czod";
import type { CustomFormProps, User } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import i18n from '@/i18n/config';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { roles } from '@/constants/role';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import ErrorCodeField from '@/components/ErrorCodeField';
import { useMemo } from 'react';
import { useFetchAllDepartments } from '@/hooks/queries/useDepartmentMutations';
import { MultiSelect } from '@/components/multi-select';
import Required from '@/components/Required';
import { SelectWithButton } from '@/components/SelectWithButton';

const updateUserSchema = z.object({
    id: z.string(),
    name: z.string().nonempty(i18n.t("zod.errors.name.required")),
    email: cz.email(),
    role: z.enum(roles),
    departmentRoleUsers: z.array(z.string()).min(1, i18n.t("zod.errors.department.required")),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UpdateUserFormProps extends CustomFormProps<UpdateUserFormData> {
    user: User; // existing user data
}

const UpdateUserForm = ({
    onSubmit,
    user,
    isPending = false,
    onCancel,
    error
}: UpdateUserFormProps) => {

    const { t } = useTranslation();

    const form = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            departmentRoleUsers: user.departmentRoleUsers.map(item => item.departmentRole.id),
        },
    });

    const { handleSubmit } = form;

    const { data: departmentsRes } = useFetchAllDepartments();

    const departmentRoles = useMemo(() => {
        if (!Array.isArray(departmentsRes?.departments)) return [];
        return departmentsRes.departments.filter(item => item.roles.length > 0).map(item => ({
            heading: item.name,
            options: [
                ...item.roles.map(role => ({
                    label: role.name,
                    value: role.id
                }))
            ]
        }))
    }, [departmentsRes?.departments])

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
                                <SelectWithButton
                                    items={roles.map(role => ({ value: role, label: t(`role.options.${role.toLowerCase()}`) }))}
                                    value={field.value}
                                    placeholder={t('user.forms.update.role.placeholder')}
                                    onChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Department */}
                <FormField
                    control={form.control}
                    name="departmentRoleUsers"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="font-medium">
                                {t("user.forms.add.department.label")} <Required />
                            </FormLabel>
                            <FormControl>
                                <MultiSelect
                                    placeholder={t("user.forms.add.department.placeholder")}
                                    defaultValue={field.value}
                                    options={departmentRoles}
                                    value={field.value}
                                    onValueChange={field.onChange}
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
                        loadingText={t('user.forms.update.actions.submit.loading')}
                        isLoading={isPending}
                    >
                        {t('user.forms.update.actions.submit.label')}
                    </LoadingButton>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                    >
                        {t('user.forms.update.actions.cancel.label')}
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default UpdateUserForm;
