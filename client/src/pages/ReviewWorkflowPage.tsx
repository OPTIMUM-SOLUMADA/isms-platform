import { useState } from "react";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reviewStageIcons } from "@/constants/icon";
import WithTitle from "@/templates/layout/WithTitle";
import { useTranslation } from "react-i18next";
import { useFetchMyReviews, useGetReviewStats } from "@/hooks/queries/useReviewMutation";
import { ReviewTable } from "@/templates/reviews/table/ReviewTable";
import { useNavigate } from "react-router-dom";
import useReviewStore, { FilterStatus } from "@/stores/review/useReviewStore";

export default function ReviewWorkflowPage() {
  const { reviews, setFilter, filter } = useReviewStore();
  const [activeTab, setActiveTab] = useState<FilterStatus>(filter.status || "ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { isLoading } = useFetchMyReviews();
  const { data: stats } = useGetReviewStats();

  const workflowStages = [
    { id: "PENDING", label: "review.pendingReview", color: "gray" },
    { id: "IN_REVIEW", label: "review.inProgress", color: "blue" },
    { id: "APPROVED", label: "review.completed", color: "green" },
    { id: "EXPIRED", label: "review.overdue", color: "red" },
  ];

  function handleTabClick(tab: FilterStatus) {
    setActiveTab(tab);
    setFilter({
      ...filter,
      status: tab,
    });
  }

  const getStageIcon = (stage: string) => {
    const Icon = reviewStageIcons[stage as keyof typeof reviewStageIcons];
    return Icon;
  };

  return (
    <WithTitle>
      <div className="space-y-6 flex flex-col grow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="page-title">{t("review.title")}</h1>
            <p className="page-description">{t("review.subtitle")}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid-cols-1 md:grid-cols-4 gap-4 hidden">
          {workflowStages.map((stage) => {

            const count = reviews.filter(
              (item) => item.document?.status === stage.id
            ).length;

            const Icon = getStageIcon(stage.id);

            return (
              <Card key={stage.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{t(stage.label)}</p>
                      <p
                        className={`text-2xl font-bold text-${stage.color}-600`}
                      >
                        {count}
                      </p>
                    </div>
                    <Icon className={`h-8 w-8 text-${stage.color}-600`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="hidden">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t("review.search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Tabs */}
        <Card className="flex flex-col grow">
          <CardContent className="mt-5 flex flex-col grow">
            <Tabs value={activeTab} onValueChange={v => handleTabClick(v as FilterStatus)}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="ALL">
                  {t("review.all")} ({stats?.all || 0})
                </TabsTrigger>
                <TabsTrigger value="PENDING">
                  {t("review.pending")} ({stats?.pending || 0})
                </TabsTrigger>
                <TabsTrigger value="APPROVED">
                  {t("review.approved")} ({stats?.approved || 0})
                </TabsTrigger>
                <TabsTrigger value="REJECTED">
                  {t("review.rejected")} ({stats?.rejected || 0})
                </TabsTrigger>
                <TabsTrigger value="EXPIRED">
                  {t("review.overdue")} ({stats?.expired || 0})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <ReviewTable
              data={reviews}
              onView={(item) => navigate(`/review-approval/${item.id}`)}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </div>
    </WithTitle>
  );
}
