import { useState } from "react";
import { GitBranch, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reviewStageIcons } from "@/constants/icon";
import WithTitle from "@/templates/layout/WithTitle";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ReviewForm from "@/templates/reviews/forms/ReviewForm";
import { useDocument } from "@/contexts/DocumentContext";
import useUserStore from "@/stores/user/useUserStore";
import ReviewItem from "@/templates/reviews/ReviewItem";
import { useFetchReviews } from "@/hooks/queries/useReviewMutation";

export default function ReviewWorkflowPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority] = useState("all");
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { users } = useUserStore();
  const { documents } = useDocument();

  // const { toast } = useToast();
  // const { viewers, createViewer } = useViewer();

  const { data = [] } = useFetchReviews();

  console.log(data);

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
    } else {
      stage = "EXPIRED"; // terminé + rejeté
    }

    // tu peux mettre une logique métier pour priority
    const priority = "normal"; // ou "high", "low" selon tes règles

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

    const matchesTab = activeTab === "all" || item.stage === activeTab;
    const matchesPriority =
      filterPriority === "all" || item.priority === filterPriority;

    return matchesSearch && matchesTab && matchesPriority;
  });

  const getStageIcon = (stage: string) => {
    const Icon = reviewStageIcons[stage as keyof typeof reviewStageIcons];
    return Icon;
  };

  // const handleCreateReview = useCallback(
  //   async (newReview: any) => {
  //     const res = await createViewer(newReview);

  //     if (res) {
  //       toast({
  //         title: t("components.toast.success.title"),
  //         description: t("components.toast.success.document.created"),
  //         variant: "success",
  //       });
  //       setOpen(false);
  //     }
  //   },
  //   [createViewer, setOpen, toast, t]
  // );

  return (
    <WithTitle>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="page-title">{t("review.title")}</h1>
            <p className="page-description">{t("review.subtitle")}</p>
          </div>

          {/* ----------- Modal Trigger ---------- */}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <GitBranch className="h-4 w-4" />
                <span>{t("review.button.buttonNewReview")}</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("review.form.newReview")}</DialogTitle>
              </DialogHeader>
              {/* <ReviewForm
                documents={documents}
                users={users}
                // onSubmit={handleCreateReview}
              /> */}
            </DialogContent>
          </Dialog>
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
        <Card>
          <CardContent className="mt-5">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">
                  {t("review.all")} ({data.length})
                </TabsTrigger>
                <TabsTrigger value="in-review">
                  {t("review.inReview")} (
                  {data.filter((i) => i.status === "IN_REVIEW").length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  {t("review.approved")} (
                  {data.filter((i) => i.status === "APPROVED").length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  {t("review.rejected")} (
                  {data.filter((i) => i.status === "EXPIRED").length})
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
