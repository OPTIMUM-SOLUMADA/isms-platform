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
import { useFetchAllDepartments } from '@/hooks/queries/useDepartmentMutations';
import { MultiSelect } from '@/components/multi-select';
import Required from '@/components/Required';
import { useMemo, useState, useEffect } from 'react';
import { userService } from '@/services/userService';

const addUserSchema: z.ZodSchema<any> = z.object({
    name: z.string().nonempty(i18n.t("zod.errors.name.required")),
    email: cz.email(),
    role: z.enum(roles),
    departmentRoleUsers: z.array(z.string()).min(1, i18n.t("zod.errors.department.required")),
    sendInvitationLink: z.boolean().optional().default(true),
    isActive: z.boolean().optional().default(false),
    userId: z.string().optional().default(''),
});
// Note: La vérification Gmail est effectuée de manière asynchrone dans le formulaire

export type AddUserFormData = z.infer<typeof addUserSchema>;

interface AddUserFormProps extends CustomFormProps<AddUserFormData> {
    departments: Department[];
}

const AddUserForm = ({
    onSubmit,
    isPending = false,
    onCancel,
    error
}: AddUserFormProps) => {

    const { t } = useTranslation();
    const [isVerifyingGmail, setIsVerifyingGmail] = useState(false);
    const [gmailVerificationError, setGmailVerificationError] = useState<string>('');

    const form = useForm<AddUserFormData>({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "VIEWER",
            departmentRoleUsers: [],
            sendInvitationLink: true,
            isActive: true
        },
    });

    const { handleSubmit, watch, setError, clearErrors } = form;
    const emailValue = watch('email');
    const roleValue = watch('role');

    // Fonction pour vérifier si l'email utilise Gmail/Google Workspace
    const verifyGmailAccount = async (email: string) => {
        if (!email) {
            return;
        }

        // Vérifier uniquement pour les rôles ADMIN, CONTRIBUTOR et REVIEWER
        if (roleValue !== 'ADMIN' && roleValue !== 'CONTRIBUTOR' && roleValue !== 'REVIEWER') {
            return;
        }

        setIsVerifyingGmail(true);
        setGmailVerificationError('');
        clearErrors('email');

        try {
            const response = await userService.verifyGmailAccount(email);
            
            if (!response.data.valid) {
                const errorMessage = t('zod.errors.email.gmailInvalid', { defaultValue: 'Cette adresse email n\'utilise pas Gmail/Google Workspace. Seuls les comptes Gmail sont autorisés pour ce rôle.' });
                setGmailVerificationError(errorMessage);
                setError('email', {
                    type: 'manual',
                    message: errorMessage,
                });
            } else {
                setGmailVerificationError('');
                clearErrors('email');
            }
        } catch (err) {
            console.error('Gmail verification failed:', err);
            // En cas d'erreur, on ne bloque pas l'utilisateur mais on affiche un avertissement
            const errorMessage = t('zod.errors.email.gmailVerificationFailed', { defaultValue: 'Impossible de vérifier si l\'email utilise Gmail. Veuillez réessayer.' });
            setGmailVerificationError(errorMessage);
        } finally {
            setIsVerifyingGmail(false);
        }
    };

    const { data: departmentsRes } = useFetchAllDepartments();

    // Vérifier l'email Gmail lorsque le rôle change
    useEffect(() => {
        if (emailValue && (roleValue === 'ADMIN' || roleValue === 'CONTRIBUTOR' || roleValue === 'REVIEWER')) {
            verifyGmailAccount(emailValue);
        } else {
            setGmailVerificationError('');
            clearErrors('email');
        }
    }, [roleValue]);

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
                                <div className="relative">
                                    <Input
                                        {...field}
                                        placeholder={t('user.forms.add.email.placeholder')}
                                        onBlur={(e) => {
                                            field.onBlur();
                                            verifyGmailAccount(e.target.value);
                                        }}
                                        disabled={isVerifyingGmail}
                                    />
                                    {isVerifyingGmail && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                            {gmailVerificationError && !form.formState.errors.email && (
                                <p className="text-sm text-yellow-600 dark:text-yellow-500 mt-1">
                                    {gmailVerificationError}
                                </p>
                            )}
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
                                    options={departmentRoles}
                                    value={field.value}
                                    onValueChange={field.onChange}
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