import { LoadingButton } from '@/components/ui/loading-button';
import { usePublishDocument } from '@/hooks/queries/useDocumentMutations';
import { usePermissions } from '@/hooks/use-permissions';
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next';

interface PublishDocumentProps extends PropsWithChildren {
    className?: string;
    documentId: string
    loadingText?: string;
    disabled?: boolean;
    onSuccess?: () => void
}
const PublishDocument = ({
    children,
    className,
    documentId,
    loadingText = "",
    disabled = false,
    onSuccess
}: PublishDocumentProps) => {
    const { mutate: publish, isPending } = usePublishDocument();
    const { hasActionPermission } = usePermissions();
    const { t } = useTranslation();


    if (!hasActionPermission('document.publish')) return null;

    const handleClick = async () => {
        publish({ id: documentId }, {
            onSuccess: () => {
                onSuccess?.();
            }
        });
    }

    return (
        <LoadingButton
            isLoading={isPending}
            loadingText={loadingText}
            onClick={handleClick}
            title={t("document.actions.publish.label")}
            className={className}
            disabled={disabled}
        >
            {children}
        </LoadingButton>
    )
}

export default PublishDocument