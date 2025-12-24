import { useMemo, useState } from 'react';
import {
  Activity,
  Search,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading-button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import WithTitle from '@/templates/layout/WithTitle';
import { useExportAudits, useFetchAudits, useFetchStats } from '@/hooks/queries/useAuditMutation';
import { AuditTable } from '@/templates/audits/AuditTable';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useTranslation } from 'react-i18next';
import { addMonths, format, subMonths } from 'date-fns';
import i18n from '@/i18n/config';
import { useGetUsers } from '@/hooks/queries/useUserMutations';
import { UserAvatar } from '@/components/user-avatar';
import { useEffect } from 'react';

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const now = new Date();
  const [filterDateRange, setFilterDateRange] = useState<{ from: string; to: string } | null>({
    from: format(subMonths(now, 3), "yyyy-MM-dd"), // 3 months ago
    to: format(addMonths(now, 0), "yyyy-MM-dd"),
  });

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterAction, filterUser, filterStatus, filterDateRange]);

  const filter = useMemo(() => {
    return {
      ...filterDateRange,
      eventType: filterAction !== 'all' ? filterAction : undefined,
      userId: filterUser !== 'all' ? filterUser : undefined,
      status: filterStatus !== 'all' ? filterStatus : undefined,
      page: currentPage,
      limit: limit,
    }
  }, [filterDateRange, filterAction, filterUser, filterStatus, currentPage, limit]);

  const { t } = useTranslation();
  const { data, isLoading } = useFetchAudits(filter);
  const { data: stats } = useFetchStats();
  const { data: usersResponse } = useGetUsers();
  const { mutate: exportAudits, isPending } = useExportAudits();

  const filteredAudits = useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data.data;
    const resultat = data.data.filter((audit) => JSON.stringify(audit.details).toLowerCase().includes(searchTerm.toLowerCase()));
    console.log("data", resultat);
    
    return resultat;
  }, [data, searchTerm]);

  function handleExport() {
    exportAudits({
      filter: filter
    });
  }


  return (
    <WithTitle title="Audit Log">
      <div className="space-y-6 grow flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("auditLog.title")}</h1>
            <p className="text-gray-600 mt-1">{t("auditLog.subtitle")}</p>
          </div>
          <LoadingButton
            className="flex items-center space-x-2"
            isLoading={isPending}
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            <span>{t("auditLog.actions.export.label")}</span>
          </LoadingButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("auditLog.stats.total")}</p>
                  <p className="text-2xl font-bold">{stats?.total ?? '-'}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("auditLog.stats.success")}</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.success ?? '-'}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("auditLog.stats.failure")}</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats?.failure ?? '-'}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{t("auditLog.stats.today")}</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats?.today ?? '-'}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className='sticky top-0 z-50'>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              
                <DateRangePicker
                  onUpdate={(values) => setFilterDateRange({
                    from: values.range.from.toISOString(),
                    to: values.range.to.toISOString(),
                  })}
                  initialDateFrom={filterDateRange.from}
                  initialDateTo={filterDateRange.to}
                  align="start"
                  locale={i18n.language === 'fr' ? "fr-FR" : "en-GB"}
                  showCompare={false}
                />
              <div className="flex flex-1 flex-col sm:flex-row gap-2">
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("auditLog.filters.event.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("auditLog.filters.event.label")}</SelectItem>
                    {data && data.events.map(action => (
                      <SelectItem key={action} value={action}>
                        {t(`auditLog.events.${action}`, { defaultValue: action })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("auditLog.filters.user.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("auditLog.filters.user.label")}</SelectItem>
                    {usersResponse && usersResponse.users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center">
                          <UserAvatar id={user.id} name={user.name} className="mr-2 size-5" />
                          <span>{user.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("auditLog.filters.status.label")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("auditLog.filters.status.label")}</SelectItem>
                    <SelectItem value="SUCCESS">
                      {t("auditLog.status.SUCCESS", { defaultValue: 'Success' })}
                    </SelectItem>
                    <SelectItem value="FAILURE">
                      {t("auditLog.status.FAILURE", { defaultValue: 'Failure' })}
                    </SelectItem>
                  </SelectContent>
                </Select>

              </div>
              
              <div className="w-full sm:w-64 lg:w-96 ml-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t("auditLog.filters.search.placeholder", { defaultValue: "Search..."})}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <AuditTable 
          data={filteredAudits} 
          isLoading={isLoading}
          pagination={{
            currentPage: data?.page || 1,
            totalPages: data?.totalPages || 1,
            total: data?.total || 0,
            onPageChange: setCurrentPage,
          }}
        />
      </div>
    </WithTitle>
  );
}