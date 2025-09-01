
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddDocumentForm, { AddDocumentFormRef, type AddDocumentFormData } from '@/templates/forms/documents/AddDocumentForm';
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
            <h1 className="text-3xl font-bold text-gray-900">{t("document.add.title")}</h1>
            <p className="text-gray-600 mt-1">{t("document.add.subtitle")}</p>
          </div>
        </div>

        {/* Documents Add */}
        <Card className='flex-grow lg:px-20'>
          <CardHeader className='border-b'>
            <CardTitle className='text-lg font-medium'>{t("document.add.form.title")}</CardTitle>
          </CardHeader>
          <CardContent className='pt-4'>
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