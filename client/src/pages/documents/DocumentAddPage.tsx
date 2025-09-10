
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AddDocumentForm, { AddDocumentFormRef, type AddDocumentFormData } from '@/templates/documents/forms/AddDocumentForm';
import { useNavigate } from 'react-router-dom';
import WithTitle from '@/templates/layout/WithTitle';
import { useTranslation } from 'react-i18next';
import { useISOClause } from '@/contexts/ISOClauseContext';
import { useDocumentType } from '@/contexts/DocumentTypeContext';
import { useUser } from '@/contexts/UserContext';
import { useDepartment } from '@/contexts/DepartmentContext';
import { useDocument } from '@/contexts/DocumentContext';
import { useCallback, useRef } from 'react';
import BackButton from '@/components/BackButton';
import { RequiredIndicatorInfo } from '@/components/Required';

export default function DocumentAddPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { clauses } = useISOClause();
  const { types } = useDocumentType();
  const { users } = useUser();
  const { departments } = useDepartment();
  const { create, isCreating } = useDocument();

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
      <div className="space-y-6 flex-grow flex flex-col pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
              isoClauses={clauses}
              types={types}
              users={users}
              departments={departments}
              onSubmit={saveDocument}
              isPending={isCreating}
            />
          </CardContent>
        </Card>

      </div>
    </WithTitle>
  );
}