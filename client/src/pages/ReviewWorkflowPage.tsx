import { useState } from "react";
import { GitBranch, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reviewStageIcons } from "@/constants/icon";
import WithTitle from "@/templates/layout/WithTitle";
import { useTranslation } from "react-i18next";
import ReviewItem from "@/templates/reviews/ReviewItem";
import { useFetchReviews } from "@/hooks/queries/useReviewMutation";

type Tab = 'in_review' | 'approved' | 'expired' | 'all';

export default function ReviewWorkflowPage() {
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority] = useState("all");
  const { t } = useTranslation();

  const { data = [] } = useFetchReviews();

  const workflowStages = [
    { id: "PENDING", label: "review.pendingReview", color: "gray" },
    { id: "IN_REVIEW", label: "review.inProgress", color: "blue" },
    { id: "APPROVED", label: "review.completed", color: "green" },
    { id: "EXPIRED", label: "review.overdue", color: "red" },
  ];

  // Avant ton filter
  const viewersWithExtra = data.map((item) => {
    let stage: string;

    if (!item.isCompleted) {
      stage = "IN_REVIEW"; // pas encore fini
    } else if (item.isCompleted && item.decision === "APPROVE") {
      stage = "APPROVED"; // terminé + approuvé
    } else if (item.reviewDate && item.reviewDate < new Date()) {
      stage = "EXPIRED"; // terminé + rejeté
    } else {
      stage = 'IN_REVIEW';
    }

    // tu peux mettre une logique métier pour priority
    const priority = "normal";

    return {
      ...item,
      stage,
      priority,
    };
  });

  const filteredItems = viewersWithExtra.filter((item) => {
    const matchesSearch =
      item.document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.reviewer.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === "all" || item.stage === activeTab.toUpperCase();
    const matchesPriority =
      filterPriority === "all" || item.priority === filterPriority;

    return matchesSearch && matchesTab && matchesPriority;
  });

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workflowStages.map((stage) => {

            const count = data.filter(
              (item) => item.document.status === stage.id
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
          <CardContent className="mt-5">
            <Tabs value={activeTab} onValueChange={v => setActiveTab(v as Tab)}>
              <TabsList className="grid w-full grid-cols-5">

                <TabsTrigger value="all">
                  {t("review.all")} ({data.length})
                </TabsTrigger>
                <TabsTrigger value="in_review">
                  {t("review.inReview")} (
                  {data.filter((i) => !i.isCompleted).length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  {t("review.approved")} (
                  {data.filter((i) => i.isCompleted && i.decision === 'APPROVE').length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  {t("review.rejected")} (
                  {data.filter((i) => i.reviewDate! < new Date()).length})
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <div className="space-y-4">
                  {filteredItems.map((item, index) => (
                    <ReviewItem
                      key={index}
                      item={item}
                    />
                  ))}

                  {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                      <GitBranch className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No review items found
                      </h3>
                      <p className="text-gray-500">
                        Try adjusting your filters or start a new review process
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </WithTitle>
  );
}
