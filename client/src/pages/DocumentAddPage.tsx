
import { Card, CardContent } from '@/components/ui/card';
import DocumentForm from '@/templates/forms/DocumentForm';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { documents } from '@/mocks/document';
import { Document } from '@/types';
import WithTitle from '@/templates/layout/WithTitle';
import { useTranslation } from 'react-i18next';

export default function DocumentAddPage() {
  const navigate = useNavigate();
  const [documentList, setDocumentList] = useState(documents);
  const { t } = useTranslation();


  const saveDocument = (newDocument: Document) => {
    setDocumentList((prev) => {
      const exists = prev.some(d => d.id === newDocument.id);
      if (exists) {
        return prev.map(d => d.id === newDocument.id ? newDocument : d);
      }
      return [...prev, newDocument];
    })
  }
  return (
    <WithTitle title={t("document.add.title")}>
      <div className="space-y-6 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Document Repository</h1>
            <p className="text-gray-600 mt-1">Manage your ISMS policies, procedures, and documentation</p>
          </div>
        </div>

        {/* Documents Add */}
        <Card className='flex-grow'>
          <CardContent className="p-0">
            <DocumentForm
              onSubmit={saveDocument}
              onCancel={() => navigate("/documents")}
            // error={errorCode}
            />
          </CardContent>
        </Card>

      </div>
    </WithTitle>
  );
}