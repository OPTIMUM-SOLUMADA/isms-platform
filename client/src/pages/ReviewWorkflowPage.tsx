import { useState } from "react";
import {
  GitBranch,
  User,
  Calendar,
  MessageCircle,
  Eye,
  Search,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Badge } from '@/components/ui/badge';
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { reviewStageIcons } from "@/constants/icon";
import { reviewItems } from "@/mocks/review";
import WithTitle from "@/templates/layout/WithTitle";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ReviewForm from "@/templates/forms/reviews/ReviewForm";
import { useUser } from '@/contexts/UserContext';
import { useDocument } from "@/contexts/DocumentContext"


export default function ReviewWorkflowPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority] = useState("all");
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { users } = useUser();
  const { documents } = useDocument();

  const workflowStages = [
    { id: "pending", label: "review.pendingReview", color: "gray" },
    { id: "in-review", label: "review.inProgress", color: "blue" },
    { id: "approved", label: "review.completed", color: "green" },
    { id: "rejected", label: "review.overdue", color: "red" },
  ];

  const filteredItems = reviewItems.filter((item) => {
    const matchesSearch =
      item.document.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  // const getInitials = (name: string) => {
  //   return name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("");
  // };

  // const getDaysUntilDue = (dueDate: string) => {
  //   const due = new Date(dueDate);
  //   const today = new Date();
  //   const diffTime = due.getTime() - today.getTime();
  //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   return diffDays;
  // };

  const handleCreateReview = (data: any) => {
    console.log("Nouvell", data);
    setOpen(false);

  }
  return (
    <WithTitle>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t('review.title')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('review.subtitle')}
            </p>
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
              <ReviewForm documents={documents} users={users} onSubmit={handleCreateReview} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workflowStages.map((stage) => {
            const count = reviewItems.filter(
              (item) => item.stage === stage.id
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
        <Card>
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
                  {t("review.all")} ({reviewItems.length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  {t("review.pending")} (
                  {reviewItems.filter((i) => i.stage === "pending").length})
                </TabsTrigger>
                <TabsTrigger value="in-review">
                  {t("review.inReview")} (
                  {reviewItems.filter((i) => i.stage === "in-review").length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  {t("review.approved")} (
                  {reviewItems.filter((i) => i.stage === "approved").length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  {t("review.rejected")} (
                  {reviewItems.filter((i) => i.stage === "rejected").length})
                </TabsTrigger>
              </TabsList>
              <div className="mt-6">
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      className="hover:shadow-md transition-shadow duration-200"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                          {/* -------- Left Side -------- */}
                          <div className="flex-1">
                            {/* Title */}
                            <h3 className="font-semibold text-lg mb-1">
                              {item.document.title}
                            </h3>
                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-3">
                              {item.document.description}
                            </p>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-3">
                              <div className="flex items-center space-x-1">
                                <User className="h-4 w-4" />
                                <span>{t("review.reviewer")}: {item.reviewer.name}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {t("review.due")}:{" "}
                                  {new Date(item.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FileText className="h-4 w-4" />
                                <span>Version: 8.2</span>
                              </div>
                            </div>

                            {/* Comments */}
                            <div className="mb-3 px-2 py-1 bg-gray-200 rounded">
                              <p className="font-medium text-gray-700">
                                {t("review.comment")}:
                              </p>
                              <p className="text-sm text-gray-600">
                                {item.comment
                                  ? item.comment
                                  : "No comments yet"}
                              </p>
                            </div>

                            {/* ISO Clause */}
                            <div>
                              <span className=" text-xs px-2 py-1 bg-gray-200 rounded">
                                A.9 - Access Control
                              </span>
                            </div>
                          </div>

                          {/* -------- Right Side -------- */}
                          <div className="flex flex-col items-stretch space-y-2 w-40">
                            <Button className="h-50 " disabled>
                              {item.stage === "in-review"
                                ? t("review.inProgress")
                                : item.stage === "approved"
                                  ? t("review.approved")
                                  : item.stage === "rejected"
                                    ? t("review.rejected")
                                    : t("review.pending")}
                            </Button>
                            <Button variant="outline" className="h-55">
                              <Eye className="h-4 w-4 mr-1" />
                              View Document
                            </Button>
                            <Button variant="outline" className="h-50">
                              <MessageCircle className="h-4 w-4 mr-1" />
                              Add Comment
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
