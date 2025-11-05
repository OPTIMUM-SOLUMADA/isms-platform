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
  Clock,
  Download,
  Rocket,
  Archive,
  Users,
  Building2,
  BookLock,
  GitBranch,
  FileStack,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/BackButton";
import DocumentPreview from "@/templates/documents/tabs/DocumentPreview";
// import DocumentApproval from "@/templates/forms/documents/DocumentApproval";
// import AuditLog from "@/templates/forms/documents/AuditLog";
import { documentStatusColors } from "@/constants/color";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WithTitle from "@/templates/layout/WithTitle";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDocument } from "@/contexts/DocumentContext";
import { useCallback, useEffect } from "react";
import { UserHoverCard } from "@/templates/users/hovercard/UserHoverCard";
import { useAuth } from "@/contexts/AuthContext";
import { formatDate } from "@/lib/date";
import { usePermissions } from "@/hooks/use-permissions";
import { Document } from "@/types";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/ui/loading-button";
import DocumentDetailSkeleton from "@/components/loading/DocumentDetailSkeleton";
import ErrorDisplay from "@/components/ErrorDisplay";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { documentStatus } from "@/constants/document";
import PublishDocument from "@/templates/documents/actions/PublishDocument";
import UnpublishDocument from "@/templates/documents/actions/UnpublishDocument";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useDocumentUI } from "@/stores/document/useDocumentUi";
import { useGetDocument } from "@/hooks/queries/useDocumentMutations";
import DepartmentRoleHoverCard from "@/templates/departments/hovercard/departmentRoleHoverCard";
import ChangeLog from "@/templates/documents/tabs/ChangeLog";
import DocumentVersionHistory from "@/templates/documents/tabs/DocumentVersionHistory";

const tabs = [
  {
    id: "preview",
    label: "document.view.tabs.preview.label",
    icon: FileText,
    content: (document: Document) => {
      const currentVersion = document.versions.find(v => v.isCurrent);
      if (!currentVersion) return null;
      return <DocumentPreview version={currentVersion} mode="view" />
    }
  },
  {
    id: "change-log",
    label: "document.view.tabs.changeLog.label",
    icon: Clock,
    content: (document: Document) => {
      return <ChangeLog document={document} />
    }
  },
  {
    id: "version-history",
    label: "document.view.tabs.versionsHistory.label",
    icon: FileStack,
    content: (document: Document) => {
      return <DocumentVersionHistory document={document} />
    }
  },
  {
    id: "reviews-log",
    label: "document.view.tabs.reviewsLog.label",
    icon: GitBranch,
    content: (document: Document) => {
      return <ChangeLog document={document} />
    }
  },
];

const UserIcon = ({ numberOfUsers }: { numberOfUsers: number }) => {
  return numberOfUsers <= 1 ? (
    <User className="h-4 w-4 text-muted-foreground" />
  ) : (
    <Users className="h-4 w-4 text-muted-foreground" />
  )
}

export default function DocumentDetailPage() {

  const { t } = useTranslation();
  const navigate = useNavigate();

  const params = useParams();

  const { isDeleted, download, isDownloading } = useDocument();
  const { user } = useAuth();
  const { hasActionPermission } = usePermissions();
  const [activeTab, setActiveTab] = useLocalStorage(`documentDetailTab-${user?.id}-${params.id}`, tabs[0].id);

  // get document by id
  const {
    data: document,
    isLoading,
    isError,
    refetch
  } = useGetDocument(params.id);

  const { openDelete, setCurrentDocument } = useDocumentUI();

  const handleDelete = useCallback(async () => {
    if (!document) return;
    setCurrentDocument(document);
    openDelete();
  }, [document, openDelete, setCurrentDocument]);

  useEffect(() => {
    if (isDeleted) {
      navigate("/documents");
    }
  }, [isDeleted, navigate]);


  if (isLoading) return <DocumentDetailSkeleton />;

  if (isError) return (
    <ErrorDisplay />
  )

  if (!document) return <p>Document not found.</p>;

  return (
    <WithTitle title={document.title}>
      <div className="flex flex-col flex-grow">
        <BreadcrumbNav
          items={[
            { label: t("document.title"), href: "/documents" },
            { label: t("document.view.title") },
          ]}
          className="mb-3"
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <BackButton />
            <div>
              <h1 className="page-title">{document.title}</h1>
              <p className="page-description">{document.description}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {document.published ? (
              <UnpublishDocument
                documentId={document.id}
                onSuccess={refetch}
              >
                <Archive className="h-4 w-4 mr-1" />
                {t("document.view.actions.unpublish.label")}
              </UnpublishDocument>
            ) : (
              <PublishDocument
                documentId={document.id}
                disabled={document.status !== documentStatus.APPROVED}
                onSuccess={refetch}
              >
                <Rocket className="h-4 w-4 mr-1" />
                {t("document.view.actions.publish.label")}
              </PublishDocument>
            )}

            {hasActionPermission("document.edit") && (
              <Button variant="outline" onClick={() => navigate(`/documents/edit/${document.id}`)}>
                <Pencil className="h-4 w-4 mr-1" />
                {t("document.view.actions.edit.label")}
              </Button>
            )}

            {hasActionPermission("document.delete") && (
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-1" />
                {t("document.view.actions.delete.label")}
              </Button>
            )}
          </div>
        </div>

        {/* Document Info */}
        <Card className="text-sm mb-6">
          <CardHeader>
            <CardTitle>{t("document.view.detail.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {/* Ownership & People */}
              <div className="border p-2 space-y-3">
                <h3 className="font-semibold">{t("document.view.detail.ownership")}</h3>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("document.view.detail.owner")}</span>
                  <span className="font-medium">{document.owner?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon numberOfUsers={document.authors.length} />
                  <span className="text-sm text-muted-foreground">{t("document.view.detail.authors")}</span>
                  <div className="flex gap-1">
                    {document.authors.map((o, i) => (
                      <UserHoverCard key={i} user={o.user} currentUserId={user?.id} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon numberOfUsers={document.reviewers.length} />
                  <span className="text-sm text-muted-foreground">{t("document.view.detail.reviewers")}</span>
                  <div className="flex gap-1">
                    {document.reviewers.map((o, i) => (
                      <UserHoverCard key={i} user={o.user} currentUserId={user?.id} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Status & Metadata */}
              <div className="border p-2 space-y-3">
                <h3 className="font-semibold">{t("document.view.detail.metadata")}</h3>

                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("document.view.detail.status")}</span>
                  <Badge className={documentStatusColors[document.status.toLowerCase()]}>
                    {t(`common.document.status.${document.status.toLowerCase()}`)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("document.view.detail.version")}</span>
                  <Badge variant="outline">
                    {document.versions.find((v) => v.isCurrent)?.version}
                  </Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("document.view.detail.lastUpdated")}</span>
                  <span className="font-medium">
                    {formatDate(document.updatedAt, { day: "numeric", month: "short", year: "numeric" }, "en-US")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("document.view.detail.reviewFrequency")}</span>
                  <span className="font-medium">
                    {t(`document.add.form.fields.reviewFrequencyUnit.options.${document.reviewFrequency?.toLowerCase()}`)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("document.view.detail.nextReview")}</span>
                  <span className="font-medium">
                    {document.nextReviewDate &&
                      formatDate(document.nextReviewDate, { day: "numeric", month: "short", year: "numeric" }, "en-US")}
                  </span>
                </div>
              </div>

              {/* Compliance */}
              <div className="border p-2 space-y-3 lg:col-span-1">
                <h3 className="font-semibold">{t("document.view.detail.compliance")}</h3>
                <div className="flex items-center gap-2">
                  <BookLock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("document.view.detail.isoClause")}</span>
                  <span className="font-medium">{document.isoClause?.code}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookLock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("document.view.detail.classification")}</span>
                  <span className="font-medium">{t(`common.document.classification.${document.classification.toLowerCase()}`)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{t("document.view.detail.department")}</span>
                  {Array.isArray(document.departmentRoles) && document.departmentRoles.map(
                    (d, index) => (
                      <DepartmentRoleHoverCard role={d.departmentRole} key={index} />
                    ))}
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Main Layout: sidebar + content */}
        <Tabs
          orientation="vertical"
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-row items-start gap-6 justify-center flex-grow"
        >
          {/* Sidebar Tabs */}
          <TabsList className="shrink-0 grid grid-cols-1 min-w-28 p-0 bg-background gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center justify-start gap-2 py-2 text-sm min-w-52">
                  <Icon className="w-4 h-4" />
                  {t(tab.label)}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <Card className="flex items-center justify-center w-full h-full p-2 flex-grow flex-col">
            <div className="w-full flex items-center justify-end">
              {hasActionPermission("document.download") && (
                <LoadingButton
                  type="button"
                  variant="ghost"
                  onClick={() => download({ id: document.id })}
                  isLoading={isDownloading}
                  loadingText={t("document.view.actions.download.loading")}
                >
                  <Download className="h-4 w-4 mr-1" />
                  {t("document.view.actions.download.label")}
                </LoadingButton>
              )}
            </div>
            {tabs.map((tab) => (
              <TabsContent
                key={tab.id}
                value={tab.id}
                className={cn("w-full flex-grow flex flex-col")}
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

