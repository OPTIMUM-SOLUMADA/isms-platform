import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFetchDocumentTypes } from '@/hooks/queries/useDocumentTypeMutations';
import { useDocumentTypeStore } from '@/stores/document-type/useDocumentTypeStore';
import { useDocumentTypeUIStore } from '@/stores/document-type/useDocumentTypeUIStore';
import { DocumentTypeTable } from '@/templates/document-types/table/DocumentTypeTable';
import WithTitle from '@/templates/layout/WithTitle';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next'

const DocumentTypePage = () => {
    const { t } = useTranslation();
    const { documentTypes } = useDocumentTypeStore();
    const { openAdd } = useDocumentTypeUIStore();

    const { isLoading } = useFetchDocumentTypes();

    return (
        <WithTitle title={t('documentType.title')}>
            <div className="space-y-6 flex flex-col flex-grow">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="page-title">{t("documentType.title")}</h1>
                        <p className="page-description">{t("documentType.subtitle")}</p>
                    </div>

                    <Button className="flex items-center space-x-2" onClick={openAdd}>
                        <Plus className="h-4 w-4" />
                        <span>{t("documentType.actions.add.label")}</span>
                    </Button>
                </div>

                <Card className='flex-grow flex flex-col'>
                    <DocumentTypeTable
                        data={documentTypes}
                        isLoading={isLoading}
                    />
                </Card>
            </div>
        </WithTitle>
    )
}

export default DocumentTypePage   