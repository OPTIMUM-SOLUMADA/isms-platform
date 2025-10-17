
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddDocumentForm, { AddDocumentFormRef, type AddDocumentFormData } from '@/templates/documents/forms/AddDocumentForm';
import { useNavigate } from 'react-router-dom';
import WithTitle from '@/templates/layout/WithTitle';
import { useTranslation } from 'react-i18next';
import { useDocument } from '@/contexts/DocumentContext';
import { useCallback, useRef } from 'react';
import BackButton from '@/components/BackButton';
import { RequiredIndicatorInfo } from '@/components/Required';
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
import useDepartmentRoleStore from '@/stores/department/useDepatrmentRoleStore';

export default function DocumentAddPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isoClauses } = useISOClauseStore();
  const { documentTypes } = useDocumentTypeStore();
  const { users } = useUserStore();
  const { departments } = useDepartmentStore();
  const { departmentRoles } = useDepartmentRoleStore();
  const { create, isCreating } = useDocument();

  // data need to be fetched
  useFetchDepartments();
  useFetchDocumentTypes();
  useFetchUsers();
  useFetchISOClauses();
  useFetchOwners();

  const formRef = useRef<AddDocumentFormRef>(null);

  const saveDocument = useCallback(async (newDocument: AddDocumentFormData) => {
    await create(newDocument);
    const form = formRef.current;
    if (!form) return;
    form.resetForm();
    if (!form.isStay()) navigate("/documents");
  }, [create, navigate]);

  return (
    <WithTitle title={t("document.add.title")}>
      <div className="flex-grow flex flex-col pb-10">
        <BreadcrumbNav
          items={[
            { label: t("document.title"), href: "/documents" },
            { label: t("document.add.title") },
          ]}
          className="mb-3"
        />
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          <BackButton />
          <div>
            <h1 className="page-title">{t("document.add.title")}</h1>
            <p className="page-description">{t("document.add.subtitle")}</p>
          </div>
        </div>

        {/* Documents Add */}
        <Card className='flex-grow'>
          <CardHeader className='border-b card-header-bg'>
            <CardTitle className='text-xl font-medium'>{t("document.add.form.title")}</CardTitle>
            <CardDescription>
              <RequiredIndicatorInfo />
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-4 lg:px-20 px-10 bg-white'>
            <AddDocumentForm
              ref={formRef}
              isoClauses={isoClauses}
              types={documentTypes}
              users={users}
              departments={departments}
              departmentRoles={departmentRoles}
              onSubmit={saveDocument}
              isPending={isCreating}
            />
          </CardContent>
        </Card>

      </div>
    </WithTitle>
  );
}