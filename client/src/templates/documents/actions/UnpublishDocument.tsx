import { LoadingButton } from '@/components/ui/loading-button';
import { useUnpublishDocument } from '@/hooks/queries/useDocumentMutations';
import { usePermissions } from '@/hooks/use-permissions';
import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next';

interface UnpublishDocumentProps extends PropsWithChildren {
    className?: string;
    documentId: string
    loadingText?: string;
    disabled?: boolean;
    onSuccess?: () => void
}
const UnpublishDocument = ({
    children,
    className,
    documentId,
    loadingText = "",
    disabled = false,
    onSuccess
}: UnpublishDocumentProps) => {
    const { mutate: unpublish, isPending } = useUnpublishDocument();
    const { hasActionPermission } = usePermissions();
    const { t } = useTranslation();

    if (!hasActionPermission('document.unpublish')) return null;

    const handleClick = async () => {
        unpublish({ id: documentId }, {
            onSuccess: () => {
                onSuccess?.();
            }
        });
    }

    return (
        <LoadingButton
            isLoading={isPending}
            loadingText={loadingText}
            variant="outline-primary"
            onClick={handleClick}
            title={t("document.actions.unpublish.label")}
            className={className}
            disabled={disabled}
        >
            {children}
        </LoadingButton>
    )
}

export default UnpublishDocument