import { FC, useCallback, useState } from "react";
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
import { useUser } from "@/contexts/UserContext";
import { useDocument } from "@/contexts/DocumentContext";
// import { ReviewFormData } from "@/templates/forms/Review/ReviewForm";
import { useToast } from "@/hooks/use-toast";
import { useViewer } from "@/contexts/DocumentReviewContext";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewWorkflowPage() {

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority] = useState("all");
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { users } = useUser();
  const { documents } = useDocument();

  const { toast } = useToast();
  const { viewers, createViewer, updateComment } = useViewer();

  const workflowStages = [
    { id: "PENDING", label: "review.pendingReview", color: "gray" },
    { id: "IN_REVIEW", label: "review.inProgress", color: "blue" },
    { id: "APPROVED", label: "review.completed", color: "green" },
    { id: "EXPIRED", label: "review.overdue", color: "red" },
  ];

  // Avant ton filter
  const viewersWithExtra = viewers.map((item) => {
    let stage: string;

    if (!item.isCompleted) {
      stage = "IN_REVIEW"; // pas encore fini
    } else if (item.isApproved) {
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

  const handleCreateReview = useCallback(
    async (newReview: any) => {
      const res = await createViewer(newReview);

      if (res) {
        toast({
          title: t("components.toast.success.title"),
          description: t("components.toast.success.document.created"),
          variant: "success",
        });
        setOpen(false);
      }
    },
    [createViewer, setOpen, toast, t]
  );

  const handleAddComment = useCallback(
    async (id: any, comment: any) => {
      console.log('new ====> ', id, comment);

      const res = await updateComment(id, comment);

      if (res) {
        toast({
          title: t("components.toast.success.title"),
          description: t("components.toast.success.document.created"),
          variant: "success",
        });
        setOpen(false);
      }
    },
    [updateComment, setOpen, toast, t]

  )
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


  return (
    <WithTitle>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="page-title">
              {t("review.title")}
            </h1>
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
              <ReviewForm
                documents={documents}
                users={users}
                onSubmit={handleCreateReview}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workflowStages.map((stage) => {

            console.log("stat", stage);

            const count = viewers.filter(
              (item) => item.document.status === stage.id
            ).length;
            console.log("counr", count);

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
                  {t("review.all")} ({viewers.length})
                </TabsTrigger>
                {/* <TabsTrigger value="pending">
                  {t("review.pending")} (
                  {viewers.filter((i) => i.status === "pending").length})
                </TabsTrigger> */}
                <TabsTrigger value="in-review">
                  {t("review.inReview")} (
                  {viewers.filter((i) => i.status === "IN_REVIEW").length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  {t("review.approved")} (
                  {viewers.filter((i) => i.status === "APPROVED").length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  {t("review.rejected")} (
                  {viewers.filter((i) => i.status === "EXPIRED").length})
                </TabsTrigger>
              </TabsList>
              <div className="mt-6">
                <div className="space-y-4">
                  {filteredItems.map((item) => {

                    return <ReviewCard
                      key={item.id}
                      item={item}
                      t={t}
                      navigate={navigate}
                      onSubmit={handleAddComment} />;
                  })
                  }

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


type ReviewCardProps = {
  item: {
    id: string;
    comment?: string;
    documentId: string;
    document: {
      title: string;
      description?: string | null;
      isoClause: { code: string; name: string };
      versions: { version: string }[];
    };
    reviewer: {
      name: string
    };
    reviewDate: Date;
    status: string;
  };
  t: (key: string) => string;
  navigate: (url: string) => void;
  onSubmit: (id: string, comment: string) => void;
};

const ReviewCard: FC<ReviewCardProps> = ({ item, t, navigate, onSubmit }) => {
  const [comment, setComment] = useState(item.comment || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    console.log('item =====', item.id, comment);

    onSubmit(item.id, comment);
    setIsEditing(false);
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
          {/* Left */}
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{item.document.title}</h3>
            <p className="text-gray-600 text-sm mb-3">{item.document.description}</p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>
                  {t("review.reviewer")}: {item.reviewer.name}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {t("review.due")}:{" "}
                  {new Date(
                    item.reviewDate
                  ).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4" />
                <span>{item.document.versions[0].version}</span>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-3 px-2 py-1 bg-gray-200 rounded">
              <p className="font-medium text-gray-700">{t("review.comment")}:</p>
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    className="w-full border rounded px-2 py-1 text-sm"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleSave}
                    >
                      {t("review.button.save")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setComment(item.comment || "");
                      }}
                    >
                      {t("review.button.cancel")}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600">{comment || "No comments yet"}</p>
              )}
            </div>

            {/* ISO Clause */}
            <div>
              <span className=" text-xs px-2 py-1 bg-gray-200 rounded">
                {item.document.isoClause.code} - {item.document.isoClause.name}
              </span>
            </div>
          </div>

          {/* Right Side*/}
          <div className="flex flex-col items-stretch space-y-2 w-40">
            <Button className="h-50 " disabled>
              {item.status === "IN_REVIEW"
                ? t("review.inProgress")
                : item.status === "APPROVED"
                  ? t("review.approved")
                  : item.status === "EXPIRED"
                    ? t("review.rejected")
                    : t("review.pending")}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(`/documents/view/${item.documentId}`)}
            >
              <Eye className="h-4 w-4 mr-1" />
              {t("review.button.viewDoc")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              {t("review.button.addComment")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
