import { LoadingButton } from '@/components/ui/loading-button';
import { useDocument } from '@/contexts/DocumentContext';
import { usePermissions } from '@/hooks/use-permissions';
import { PropsWithChildren, useState } from 'react'
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
    const { publish } = useDocument();
    const { hasActionPermission } = usePermissions();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    if (!hasActionPermission('document.publish')) return null;

    const handleClick = async () => {
        try {
            setLoading(true);
            await publish({ id: documentId });
            onSuccess?.();
        } finally {
            setLoading(false);
        }
    }

    return (
        <LoadingButton
            isLoading={loading}
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