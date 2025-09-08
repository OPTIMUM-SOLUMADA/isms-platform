
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WithTitle from '@/templates/layout/WithTitle';
import { useTranslation } from 'react-i18next';
import { useISOClause } from '@/contexts/ISOClauseContext';
import { useDocumentType } from '@/contexts/DocumentTypeContext';
import { useUser } from '@/contexts/UserContext';
import { useDepartment } from '@/contexts/DepartmentContext';
import { useDocument } from '@/contexts/DocumentContext';
import { useCallback, useRef } from 'react';
import BackButton from '@/components/BackButton';
import EditDocumentForm, { EditDocumentFormData, EditDocumentFormRef } from '@/templates/documents/forms/EditDocumentForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetDocument } from './DocumentDetailPage';
import ErrorDisplay from '@/components/ErrorDisplay';
import { RequiredIndicatorInfo } from '@/components/Required';
import CircleLoading from '@/components/loading/CircleLoading';
import ItemNotFound from '../ItemNotFound';

export default function DocumentEditPage() {
    const { t } = useTranslation();
    const { updateDocument, isUpdating } = useDocument();
    const { clauses } = useISOClause();
    const { types } = useDocumentType();
    const { users } = useUser();
    const { departments } = useDepartment();
    const navigate = useNavigate();

    const params = useParams();

    const { data: doc, isLoading, isError, error } = useGetDocument(params.id);

    const formRef = useRef<EditDocumentFormRef>(null);

    const handleUpdateDocument = useCallback(async (newDocument: EditDocumentFormData) => {
        if (!doc) return;
        const form = formRef.current;
        if (!form) return;
        await updateDocument({
            id: doc.id,
            data: newDocument
        });
        if (!form.isStay())
            navigate("/documents");
        form.resetForm();
    }, [updateDocument, doc, navigate]);


    if (isLoading) return (
        <WithTitle title={t("document.edit.fetching")}>
            <CircleLoading
                className='flex-grow'
                text={t("document.edit.loading")}
            />
        </WithTitle>
    );

    if (isError && error && !doc) return error.status === 404 ? (
        <WithTitle title={t("common.document.notFound.title")}>
            <ItemNotFound
                title={t("common.document.notFound.title")}
                description={t("common.document.notFound.description")}
                actionLabel={t("common.document.notFound.actions.goBack.label")}
                onActionClick={() => navigate("/documents")}
            />
        </WithTitle>
    ) : (
        <ErrorDisplay />
    );

    return (
        <WithTitle title={t("document.edit.title")}>
            <div className="space-y-6 flex-grow flex flex-col pb-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <BackButton />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t("document.edit.title")}</h1>
                        <p className="text-gray-600 mt-1">{t("document.edit.subtitle")}</p>
                    </div>
                </div>

                {/* Documents Edit */}
                <Card className='flex-grow'>
                    <CardHeader className='border-b card-header-bg'>
                        <CardTitle className='text-lg font-medium'>{t("document.edit.form.title")}</CardTitle>
                        <CardDescription>
                            <RequiredIndicatorInfo />
                        </CardDescription>
                    </CardHeader>
                    <CardContent className='pt-4 lg:px-20 px-10'>
                        <EditDocumentForm
                            doc={doc!}
                            ref={formRef}
                            isoClauses={clauses}
                            types={types}
                            users={users}
                            departments={departments}
                            onSubmit={handleUpdateDocument}
                            isPending={isUpdating}
                        />
                    </CardContent>
                </Card>

            </div>
        </WithTitle>
    );
}