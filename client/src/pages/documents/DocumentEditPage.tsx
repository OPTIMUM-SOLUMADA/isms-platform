
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import WithTitle from '@/templates/layout/WithTitle';
import { useTranslation } from 'react-i18next';
import { useDocument } from '@/contexts/DocumentContext';
import { useCallback, useRef } from 'react';
import BackButton from '@/components/BackButton';
import EditDocumentForm, { EditDocumentFormData, EditDocumentFormRef } from '@/templates/documents/forms/EditDocumentForm';
import { useNavigate, useParams } from 'react-router-dom';
import ErrorDisplay from '@/components/ErrorDisplay';
import { RequiredIndicatorInfo } from '@/components/Required';
import CircleLoading from '@/components/loading/CircleLoading';
import ItemNotFound from '../ItemNotFound';
import { BreadcrumbNav } from '@/components/breadcrumb-nav';
import useUserStore from '@/stores/user/useUserStore';
import useDepartmentStore from '@/stores/department/useDepatrmentStore';
import useDocumentTypeStore from '@/stores/document-type/useDocumentTypeStore';
import { useFetchDepartments } from '@/hooks/queries/useDepartmentMutations';
import { useFetchDocumentTypes } from '@/hooks/queries/useDocumentTypeMutations';
import { useFetchUsers } from '@/hooks/queries/useUserMutations';
import { useFetchISOClauses } from '@/hooks/queries/useISOClauseMutations';
import useISOClauseStore from '@/stores/iso-clause/useISOClauseStore';
import { useFetchOwners } from '@/hooks/queries/useOwnerMutations';
import { useGetDocument } from '@/hooks/queries/useDocumentMutations';

export default function DocumentEditPage() {
    const { t } = useTranslation();
    const { updateDocument, isUpdating } = useDocument();
    const { isoClauses } = useISOClauseStore();
    const { documentTypes } = useDocumentTypeStore();
    const { users } = useUserStore();
    const { departments } = useDepartmentStore();
    const navigate = useNavigate();

    // data need to be fetched
    useFetchDepartments();
    useFetchDocumentTypes();
    useFetchUsers();
    useFetchISOClauses();
    useFetchOwners();

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
            <div className="flex-grow flex flex-col pb-10">
                <BreadcrumbNav
                    items={[
                        { label: t("document.title"), href: "/documents" },
                        { label: t("document.edit.title") },
                    ]}
                    className="mb-3"
                />
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                    <BackButton />
                    <div>
                        <h1 className="page-title">{t("document.edit.title")}</h1>
                        <p className="page-description">{t("document.edit.subtitle")}</p>
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
                    <CardContent className='pt-4 lg:px-20 px-10 bg-white'>
                        {doc && (
                            <EditDocumentForm
                                doc={doc}
                                ref={formRef}
                                isoClauses={isoClauses}
                                types={documentTypes}
                                users={users}
                                departments={departments}
                                onSubmit={handleUpdateDocument}
                                isPending={isUpdating}
                            />
                        )}
                    </CardContent>
                </Card>

            </div>
        </WithTitle>
    );
}