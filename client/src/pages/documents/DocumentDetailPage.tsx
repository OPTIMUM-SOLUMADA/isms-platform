import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Pencil,
  Trash2,
  User,
  BadgeCheck,
  Layers,
  Calendar,
  RefreshCw,
  FileText,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/BackButton";
import DocPreview from "@/templates/forms/documents/DocPreview";
// import DocumentApproval from "@/templates/forms/documents/DocumentApproval";
// import AuditLog from "@/templates/forms/documents/AuditLog";
import Notification from "@/templates/forms/documents/Notification";
import { documentStatusColors } from "@/constants/color";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WithTitle from "@/templates/layout/WithTitle";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDocument } from "@/contexts/DocumentContext";
import { useCallback } from "react";
import { UserHoverCard } from "@/templates/hovercard/UserHoverCard";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/date";
import { usePermissions } from "@/hooks/use-permissions";
import { useUser } from "@/contexts/UserContext";
import { DeleteDialog } from "@/components/DeleteDialog";
import { Document } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { documentService } from "@/services/documentService";
import { ApiAxiosError } from "@/types/api";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "preview",
    label: "document.view.tabs.preview",
    icon: FileText,
    content: (document: Document) => <DocPreview filename={document.fileUrl!} />
  },
  {
    id: "notification",
    label: "document.view.tabs.changeLogs",
    icon: Clock,
    content: (document: Document) => <Notification />
  },
];

export default function DocumentDetailPage() {

  const { t } = useTranslation();
  const navigate = useNavigate();

  const params = useParams();

  const { deleteDocument } = useDocument();
  const { user } = useAuth();
  const { users } = useUser();
  const { hasActionPermission } = usePermissions();

  // get document by id
  const { data: document, isLoading, isError, error } = useGetDocument(params.id);

  const handleDelete = useCallback(async () => {
    await deleteDocument({ id: document!.id });
    navigate("/documents");
  }, [navigate, deleteDocument, document]);


  if (isLoading) return <>Loading...</>;

  if (isError) return <p>{error instanceof Error ? error.message : "Something went wrong while fetching the document."}</p>;

  if (!document) return <p>Document not found.</p>;

  return (
    <WithTitle title={document.title}>
      <div className="flex flex-col space-y-6 flex-grow">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <BackButton />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t("document.view.title", { name: document.title })}</h1>
              <p className="text-gray-600 mt-1">{document.description}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {hasActionPermission("document.edit") && (
              <Button variant="outline" onClick={() => navigate(`/documents/edit/${document.id}`)}>
                <Pencil className="h-4 w-4 mr-1" />
                {t("document.view.actions.edit.label")}
              </Button>
            )}
            {hasActionPermission("document.delete") && (
              <DeleteDialog
                entityName={document.title}
                onConfirm={handleDelete}
                trigger={
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t("document.view.actions.delete.label")}
                  </Button>
                }
              />
            )}
          </div>
        </div>

        {/* Document Info */}
        <Card className="text-sm">
          <CardHeader>
            <CardTitle>{t("document.view.detail.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("document.view.detail.owner")}:</span>
                <UserHoverCard user={document.owner} currentUserId={user?.id} />
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("document.view.detail.reviewers")}:</span>
                <div className="flex items-center gap-1">
                  {document.reviewersId.map((userId) => {
                    const fuser = users.find((u) => u.id === userId);
                    return fuser ? (
                      <UserHoverCard
                        key={userId}
                        user={fuser}
                        currentUserId={user?.id}
                      />
                    ) : null;
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("document.view.detail.status")}:</span>
                <Badge className={`${documentStatusColors[document.status.toLowerCase()]}`}>
                  {document.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("document.view.detail.version")}:</span>
                <Badge variant="outline">{document.versions.find((v) => v.isCurrent)?.version}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("document.view.detail.lastUpdated")}:</span>
                <span>
                  {formatDate(document.updatedAt, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    minute: "numeric",
                    hour: "numeric",
                    second: "numeric",
                  }, 'en-US')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{t("document.view.detail.nextReview")}:</span>
                <span>{"N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Layout: sidebar + content */}
        <Tabs
          orientation="vertical"
          defaultValue={tabs[0].id}
          className="w-full flex flex-row items-start gap-6 justify-center flex-grow"
        >
          {/* Sidebar Tabs */}
          <TabsList className="shrink-0 grid grid-cols-1 min-w-28 p-0 bg-background gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center justify-start gap-2 py-2 text-sm">
                  <Icon className="w-4 h-4" />
                  {t(tab.label)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <Card className="flex items-center justify-center w-full h-full p-2 flex-grow flex-col">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className={cn("w-full flex-grow flex flex-col", tab.id === tabs[0].id ? "flex" : "hidden")}
              >
                {tab.content(document)}
              </TabsContent>
            ))}
          </Card>
        </Tabs>

      </div>
    </WithTitle>
  );
}



export const useGetDocument = (id: string | undefined) => {
  return useQuery<Document, ApiAxiosError>({
    queryKey: ["document", id],
    queryFn: async () => {
      if (!id) throw new Error("Document ID is required");
      const res = await documentService.getById(id);
      return res.data;
    },
    enabled: !!id, // only fetch if id exists
    staleTime: 1000 * 60 * 5, // optional: cache 5 minutes
  });
};