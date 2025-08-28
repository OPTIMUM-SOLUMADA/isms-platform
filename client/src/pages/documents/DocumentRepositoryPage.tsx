import { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import { DocumentTable } from '@/templates/table/DocumentTable';
import { useTranslation } from 'react-i18next';
import { documentStatus } from '@/constants/document';
import { useDocumentType } from '@/contexts/DocumentTypeContext';
import { useISOClause } from '@/contexts/ISOClauseContext';
import { useDocument } from '@/contexts/DocumentContext';
import WithTitle from '@/templates/layout/WithTitle';
import { useUser } from '@/contexts/UserContext';
import { UserAvatar } from '@/components/user-avatar';


export const NEW_DOCUMENT_PATH = '/documents/add';

export default function DocumentRepositoryPage() {

  const navigate = useNavigate();
  const { t } = useTranslation();

  const { types } = useDocumentType();
  const { clauses } = useISOClause();
  const { documents, loading, stats } = useDocument();
  const { users } = useUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterOwner, setFilterOwner] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterClause, setFilterClause] = useState('all');

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
    const matchesType = filterType === 'all' || doc.categoryId === filterType;
    const matchesClause = filterClause === 'all' || doc.isoClauseId === filterClause;
    const matchesOwner = filterOwner === 'all' || doc.ownerId === filterOwner;
    return matchesSearch && matchesStatus && matchesType && matchesClause && matchesOwner;
  });

  return (
    <WithTitle title={t("document.title")}>
      <div className="space-y-6 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("document.title")}</h1>
            <p className="text-gray-600 mt-1">{t("document.subtitle")}</p>
          </div>
          <Link to={NEW_DOCUMENT_PATH} >
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{t("document.add.title")}</span>
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-theme-2">{t("document.stats.total.title")}</p>
                  <p className="text-2xl font-bold">{stats?.total || 0}</p>
                </div>
                <FileText className="h-8 w-8 text-theme-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("document.stats.approved.title")}</p>
                  <p className="text-2xl font-bold text-theme">
                    {stats?.approved || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-theme" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("document.stats.inReview.title")}</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats?.inReview || 0}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("document.stats.draft.title")}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats?.draft || 0}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search documents, owners, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterOwner} onValueChange={setFilterOwner}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder={t("document.filter.owner.title")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("document.filter.owner.placeholder")}</SelectItem>
                    {users.map((user, index) => (
                      <SelectItem key={index} value={user.id}>
                        <div className='flex items-center gap-2'>
                          <UserAvatar
                            id={user.id}
                            name={user.name}
                            className="size-6"
                          />
                          <span>{user.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder={t("document.filter.status.title")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("document.filter.status.placeholder")}</SelectItem>
                    {Object.entries(documentStatus).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {t(`common.document.status.${value.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder={t('document.filter.type.title')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('document.filter.type.placeholder')}</SelectItem>
                    {types.map((item, index) => (
                      <SelectItem key={index} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterClause} onValueChange={setFilterClause}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder={t('document.filter.isoClause.title')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('document.filter.isoClause.placeholder')}</SelectItem>
                    {clauses.map((item, index) => (
                      <SelectItem key={index} value={item.id}>
                        {item.code} - {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card className='flex-grow flex flex-col'>
          <DocumentTable
            data={filteredDocuments}
            onCreateNewDocument={() => navigate(NEW_DOCUMENT_PATH)}
            onView={(doc) => navigate(`view/${doc.id}`)}
            isLoading={loading}
          />
        </Card>
      </div>
    </WithTitle>
  );
}