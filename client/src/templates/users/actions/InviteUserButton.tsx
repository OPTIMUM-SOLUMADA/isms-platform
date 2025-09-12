import { LoadingButton } from '@/components/ui/loading-button';
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { userService } from '@/services/userService';
import { ApiAxiosError } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { SendIcon } from 'lucide-react';
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next';

interface InviteUserButtonProps extends PropsWithChildren {
    className?: string;
    userId: string;
}
const InviteUserButton = ({
    children,
    userId,
    className
}: InviteUserButtonProps) => {
    const { hasActionPermission } = usePermissions();
    const { t } = useTranslation();


    const { toast } = useToast();
    // send invitation query
    const { mutate: send, isPending } = useMutation<any, ApiAxiosError, { userId: string }>({
        mutationFn: ({ userId }) => userService.sendInvitation(userId),
        onSuccess: () => {
            toast({
                title: t("components.toast.success.title"),
                description: t("components.toast.success.user.invited"),
                variant: "success",
            });
        },
        onError: () => {
            toast({
                title: t("components.toast.error.title"),
                description: t("components.toast.error.user.invited"),
                variant: "destructive",
            });
        }
    });


    if (!hasActionPermission('document.download')) return null;

    return (
        <LoadingButton
            isLoading={isPending}
            loadingText={''}
            variant="outline"
            onClick={() => send({ userId })}
            title={t("user.actions.sendInvitation.label")}
            className={cn(className)}
        >
            {children || (
                <>
                    <SendIcon className='h-4 w-4' />
                </>
            )}
        </LoadingButton>
    );
};


export default InviteUserButton