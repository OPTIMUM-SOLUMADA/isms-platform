import { useState } from 'react';
import {
  Activity,
  Search,
  Download,
  Calendar,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import WithTitle from '@/templates/layout/WithTitle';
import { useFetchAudits, useFetchStats } from '@/hooks/queries/useAuditMutation';
import { AuditTable } from '@/templates/audits/AuditTable';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useTranslation } from 'react-i18next';
import { addMonths, format, subMonths } from 'date-fns';
import i18n from '@/i18n/config';

export default function AuditLogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterResourceType, setFilterResourceType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const now = new Date();
  const [filterDateRange, setFilterDateRange] = useState<{ from: string; to: string } | null>({
    from: format(subMonths(now, 3), "yyyy-MM-dd"), // 3 months ago
    to: format(addMonths(now, 0), "yyyy-MM-dd"),
  });

  const { t } = useTranslation();
  const { data = [], isLoading } = useFetchAudits(filterDateRange);
  const { data: stats } = useFetchStats();


  const uniqueActions = [...new Set(data.map(entry => entry.eventType))];

  return (
    <WithTitle title="Audit Log">
      <div className="space-y-6 grow flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("auditLog.title")}</h1>
            <p className="text-gray-600 mt-1">{t("auditLog.subtitle")}</p>
          </div>
          <Button className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>{t("auditLog.actions.export.label")}</span>
          </Button>
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
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by resource, user, action, or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    {uniqueActions.map(action => (
                      <SelectItem key={action} value={action}>{action}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterResourceType} onValueChange={setFilterResourceType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>

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
              </div>
            </div>
          </CardContent>
        </Card>

        <AuditTable data={data} isLoading={isLoading} />
      </div>
    </WithTitle>
  );
}