import { LoadingButton } from '@/components/ui/loading-button';
import { useDocument } from '@/contexts/DocumentContext';
import { usePermissions } from '@/hooks/use-permissions';
import { PropsWithChildren, useState } from 'react'
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
    const { unpublish } = useDocument();
    const { hasActionPermission } = usePermissions();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    if (!hasActionPermission('document.unpublish')) return null;

    const handleClick = async () => {
        try {
            setLoading(true);
            await unpublish({ id: documentId });
            onSuccess?.();
        } finally {
            setLoading(false);
        }
    }

    return (
        <LoadingButton
            isLoading={loading}
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