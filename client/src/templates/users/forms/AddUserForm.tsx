import { z } from 'zod';
import { cz } from "@/lib/czod";
import type { CustomFormProps, Department } from '@/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import i18n from '@/i18n/config';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { roles } from '@/constants/role';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { SelectWithButton } from '@/components/SelectWithButton';
import ErrorCodeField from '@/components/ErrorCodeField';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useDepartmentUI } from '@/stores/department/useDepartmentUI';
import { useMemo } from 'react';

const addUserSchema: z.ZodSchema<any> = z.object({
    name: z.string().nonempty(i18n.t("zod.errors.name.required")),
    email: cz.email(),
    role: z.enum(roles),
    departmentId: z.string().nonempty(i18n.t("zod.errors.department.required")),
    departmentRoleId: z.string().nonempty(i18n.t("zod.errors.department.required")),
    sendInvitationLink: z.boolean().optional().default(true),
    isActive: z.boolean().optional().default(false),
});

export type AddUserFormData = z.infer<typeof addUserSchema>;

interface AddUserFormProps extends CustomFormProps<AddUserFormData> {
    departments: Department[];
}

const AddUserForm = ({
    onSubmit,
    departments = [],
    isPending = false,
    onCancel,
    error
}: AddUserFormProps) => {

    const { t } = useTranslation();
    const { openAdd } = useDepartmentUI();

    const form = useForm<AddUserFormData>({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "VIEWER",
            departmentId: "",
            departmentRoleId: "",
            sendInvitationLink: true,
            isActive: true
        },
    });

    const { handleSubmit, watch } = form;

    // 🧠 Watch departmentId changes
    const selectedDepartmentId = watch("departmentId");
    const selectDepartmentRole = useMemo(()=>{
        return departments.find(role => role.id === selectedDepartmentId);
    }, [departments, selectedDepartmentId]);
    

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                {/* name */}
                <FormField
                    control={form.control}
                    name='name'
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
                    name='email'
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

                {/* role */}
                <FormField
                    control={form.control}
                    name='role'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('user.forms.add.role.label')}</FormLabel>
                            <FormControl>
                                <SelectWithButton
                                    items={roles.map(role => ({ value: role, label: t(`role.options.${role.toLowerCase()}`) }))}
                                    value={field.value}
                                    placeholder={t('user.forms.add.role.placeholder')}
                                    onChange={field.onChange}
                                />
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
                            <FormLabel>{t('user.forms.add.department.label')}</FormLabel>
                            <FormControl>
                                <SelectWithButton
                                    items={departments.map(dep => ({ value: dep.id, label: dep.name }))}
                                    value={field.value}
                                    placeholder={t('user.forms.add.department.placeholder')}
                                    onChange={field.onChange}
                                    onButtonClick={openAdd}
                                    addLabel={t('department.actions.add.label')}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* departmentRole */}
                <FormField
                    control={form.control}
                    name='departmentRoleId'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('user.forms.add.departmentRole.label')}</FormLabel>
                            <FormControl>
                                <SelectWithButton
                                    items={selectDepartmentRole?.roles.map(role => ({ value: role.id, label: role.name })) || []}
                                    value={field.value}
                                    placeholder={
                                        (selectDepartmentRole?.roles.length || 0) > 0
                                        ? t('user.forms.add.departmentRole.placeholder')
                                        : t('user.forms.add.departmentRole.noRoles')
                                    }
                                    onChange={field.onChange}
                                    onButtonClick={openAdd}
                                    addLabel={t('departmentRole.actions.add.label')}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Active user */}
                <FormField
                    control={form.control}
                    name='isActive'
                    render={({ field }) => (
                        <FormItem className='hidden invisible opacity-0'>
                            <FormControl>
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="isActive">
                                        {t('user.forms.add.status.label')}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <span className='text-xs'>
                                            {field.value ? t("common.user.status.active") : t("common.user.status.inactive")}
                                        </span>
                                        <Switch
                                            id='isActive'
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </div>
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Checkbox to send email invitation */}
                <FormField
                    control={form.control}
                    name='sendInvitationLink'
                    render={({ field }) => (
                        <FormItem>
                            <FormControl >
                                <div className="flex items-center justify-between space-x-2">
                                    <Label htmlFor="send-invitation">{t('user.forms.add.sendInvitation.label')}</Label>
                                    <Switch
                                        id='send-invitation'
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </div>
                            </FormControl>
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