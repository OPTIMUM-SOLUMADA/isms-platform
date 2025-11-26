import {
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import WithTitle from '@/templates/layout/WithTitle';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import  { DashboardStats, UpdcommingDeadline } from '@/components/dashboard';
import { useFetchMyReviews } from '@/hooks/queries/useReviewMutation';
import { useFetchAudits } from '@/hooks/queries/useAuditMutation';
import { useMemo } from 'react';
import { auditEventColors } from '@/constants/color';
import { cn } from '@/lib/utils';
import UserRoleRadialChart from '@/templates/dashboard/charts/UserRoleRadialChart';
import { useGetUserRolesStats } from '@/hooks/queries/useUserMutations';



export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const { reviews } = useReviewStore()
  const { data: myReviews, isLoading } = useFetchMyReviews();
  const { data: audits } = useFetchAudits({ limit: 4});
  const { data: userRolesStats } = useGetUserRolesStats();
  // Trier par date et prendre les 4 récents
  const recentActivities = useMemo(() => {
    if (!audits) return [];
    return audits.data ? audits.data
    .slice(-4) : [];
  }, [audits]);

  const mappedActivities = recentActivities?.map(audit => ({
    id: audit.id,
    type: audit.eventType, // utilisé pour mettre la couleur
    action: t(`auditLog.events.${audit.eventType}`, { defaultValue: audit.eventType }),
    document: audit.targets?.[0]?.type ?? "Unknown target",
    user: audit.user?.name ?? "Unknown user",
    role: audit.user?.role ?? "Unknown role",
    time: new Date(audit.timestamp).toLocaleString(),
  }));

  const sortedData = (myReviews ? myReviews.reviews : []).slice(-4); // garder les 3 dernières

  return (
    <WithTitle title={t("dashboard.title")}>
      <div className="space-y-6">
        {/* Stats Cards */}

        <DashboardStats />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upcoming Deadlines */}
          <UpdcommingDeadline 
            data={sortedData}
            isLoading = { isLoading }
          />

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span>{t("dashboard.card.recentActivity.title")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mappedActivities?.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div 
                    className={cn(
                      "mt-1 h-2 w-2 rounded-full",
                      auditEventColors[activity.type] ?? 'bg-gray-500'
                    )} />
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium")}>{activity.action}</p>
                    <p className="text-xs text-gray-600 truncate">{activity.user} • {activity.role}</p>
                    <p className="text-xs text-gray-500 mt-1"> {activity.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={() => navigate('/audit')}>
                {t("dashboard.card.recentActivity.actions.viewAll.label")}
              </Button>
            </CardContent>
          </Card>


          {/* Compliance Overview */}
          <Card className='flex flex-col'>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>{t("dashboard.card.userRole.title")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 grow flex items-center justify-center">
              <UserRoleRadialChart stats={userRolesStats} />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("dashboard.card.quickActions.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Button asChild className="flex flex-col items-center space-y-2 h-20">
                <Link to = "/documents/add" className="flex flex-col items-center space-y-2 text-white hover:text-white no-underline">
                  <FileText className="h-6 w-6" />
                  <span className="text-xs">{t("dashboard.card.quickActions.newDocument.label")}</span>
                </Link>
              </Button>
              <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
                <Link to = "/published-documents" className="flex flex-col items-center space-y-2 text-black hover:text-black no-underline  ">
                  <Clock className="h-6 w-6" />
                  <span className="text-xs">{t("dashboard.card.quickActions.publishedDocuments.label")}</span>
                </Link>
              </Button>
              <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
                <Link to = "/reviews" className="flex flex-col items-center space-y-2 text-black hover:text-black no-underline">
                  <CheckCircle className="h-6 w-6" />
                  <span className="text-xs">Approve Document</span>
                </Link>
              </Button>
              <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
                <Link to = "/users" className="flex flex-col items-center space-y-2 text-black hover:text-black no-underline">
                  <Users className="h-6 w-6" />
                  <span className="text-xs">{t("dashboard.card.quickActions.manageUsers.label")}</span>
                </Link>
              </Button>
              <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
                <Link to = "/audit" className="flex flex-col items-center space-y-2 text-black hover:text-black no-underline">
                  <Shield className="h-6 w-6" />
                  <span className="text-xs">{t("dashboard.card.quickActions.auditLogs.label")}</span>
                </Link>
              </Button>
              <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
                <Link to = "/pending-reviews" className="flex flex-col items-center space-y-2 text-black hover:text-black no-underline">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-xs">{t("dashboard.card.quickActions.pendingReview.label")}</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </WithTitle>
  );
}