

import { useDocument } from "@/contexts/DocumentContext";
import { useFetchUsers } from "@/hooks/queries/useUserMutations";
import { FileText, Clock, Users, AlertCircle, Badge } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LoadingSplash from '@/components/loading';
import { useFetchPendingReviews } from "@/hooks/queries/useReviewMutation";
import { DocumentReview } from "@/types";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export function DashboardStats() {
  const { documents } = useDocument();
  const { data } = useFetchUsers();
  const { data: pending } = useFetchPendingReviews();
  const { t } = useTranslation();

  const activeUsers =
    data?.data?.users?.filter((user: any) => user.isActive) || [];


  const stats = [
    {
      title: t("dashboard.stats.documents.title"),
      value:  documents.length ?? 0,
      change: "+12",
      changeType: "increase" as const,
      icon: FileText,
      color: "blue",
    },
    {
      title: t("dashboard.stats.pendingReviews.title"),
      value: pending?.length ?? 0,
      change: "-5",
      changeType: "decrease" as const,
      icon: Clock,
      color: "amber",
    },
    // {
    //   title: "Compliance Score",
    //   value: "94%",
    //   change: "+2%",
    //   changeType: "increase" as const,
    //   icon: Shield,
    //   color: "green",
    // },
    {
      title: t("dashboard.stats.activeUsers.title"),
      value: activeUsers.length,
      change: "+8",
      changeType: "increase" as const,
      icon: Users,
      color: "purple",
    },
  ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-2xl font-bold">{stat.value}</span>
                        {/* <Badge
                          variant={stat.changeType === 'increase' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {/* {stat.change} * / }
                        </Badge> */}
                      </div>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                      <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
  );
}

// UserTable component using the reusable DataTable
interface UserTableProps {
    data: DocumentReview[];
    isLoading?: boolean;
}

export function UpdcommingDeadline({data, isLoading = false}: UserTableProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (isLoading) {
    return <LoadingSplash message="Loading deadlines…" subMessage="Fetching upcoming deadlines" />;
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className=" p-6">
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <span>{t("dashboard.card.deadline.title")}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            {/* There are no upcoming deadlines. */}
            {t("dashboard.card.deadline.list.empty")}
          </p>
          <Button className="mt-3" onClick={() => navigate('/reviews')}>View Reviews</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span>{t("dashboard.card.deadline.title")}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-sm">{item.document.title}</p>
              <p className="text-xs text-gray-500 mt-1">Owner: {item.document.authors[0]?.user?.name || ''}</p>
              <p className="text-xs text-gray-500">Due: {new Date(item.dueDate).toLocaleDateString()}</p>
            </div>
            <Badge className="text-xs">{/* {item.priority} */}</Badge>
          </div>
        ))}
        <Button className="w-fit" variant="outline" onClick={() => navigate('/reviews')}>
          {t("dashboard.card.deadline.actions.viewAll.label")}
        </Button>
      </CardContent>
    </Card>
  );
}


export const complianceProgress = [
    { clause: 'A.5 Information Security Policies', progress: 100 },
    { clause: 'A.6 Organization of Information Security', progress: 95 },
    { clause: 'A.7 Human Resource Security', progress: 88 },
    { clause: 'A.8 Asset Management', progress: 92 },
    { clause: 'A.9 Access Control', progress: 85 },
    { clause: 'A.10 Cryptography', progress: 78 }
];