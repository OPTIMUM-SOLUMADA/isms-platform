import { useMemo, useState } from "react";
import { PendingReviewItem, PrendingItemPreview } from "@/templates/reviews/PendingReviewItem";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowRight, Filter } from "lucide-react";
import { useFetchPendingReviews } from "@/hooks/queries/useReviewMutation";
import WithTitle from "@/templates/layout/WithTitle";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentReview } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import CircleLoading from "@/components/loading/CircleLoading";
import { getFileIconByName } from "@/lib/icon";
import { Button } from "@/components/ui/button";
import { parseAsString, useQueryState } from "nuqs";

type StatusFilter = "approved" | "rejected" | "all";

export default function PendingReviewsDashboardPage(): JSX.Element {
  // const [filterDocument, setFilterDocument] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [selectedItem, setSelectedItem] = useState<DocumentReview | null>(null);
  const [filterDocument, setFilterDocument] = useQueryState("docId", parseAsString.withDefault(""))
  const { t } = useTranslation();

  const { data, isLoading } = useFetchPendingReviews();

  const documents = useMemo(() => {
    if (!data) return [];

    const uniqueDocs = new Map();

    for (const item of data) {
      if (item.document?.id) {
        uniqueDocs.set(item.document.id, item.document);
      }
    }

    return Array.from(uniqueDocs.values());
  }, [data]);

  const filteredReviews = useMemo(() => {
    if (!data) return [];

    let result = data;

    // Filter by document
    if (filterDocument !== "all") {
      result = result.filter((r) => r.documentId === filterDocument);
    }

    // Filter by status
    if (filterStatus === "approved") {
      result = result.filter((r) => r.decision === "APPROVE");
    } else if (filterStatus === "rejected") {
      result = result.filter((r) => r.decision === "REJECT");
    }

    return result;
  }, [data, filterDocument, filterStatus]);

  function handleSuccess(reviewId: string) {
    if (selectedItem?.id === reviewId) {
      setSelectedItem(null);
    }
  }

  const reviewCountByDocument = (documentId: string) => {
    return data?.filter((r) => r.documentId === documentId).length || 0;
  }

  if (isLoading) return <CircleLoading />;

  return (
    <WithTitle title={t("pendingReviews.title")}>
      <div className="p-8 space-y-6 flex flex-col grow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{t("pendingReviews.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("pendingReviews.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">

          </div>
        </div>

        <div className="flex flex-col grow h-full w-full">
          <div className="flex items-stretch gap-5 grow min-h-0 w-full p-5 border bg-gray-50">

            {/* Document list */}
            <div className="space-y-2 w-full max-w-64 bg-gray-100 border p-2">
              <div className="flex items-center justify-between gap-2 shrink-0  pr-5">
                <h2 className="text-sm text-muted-foreground">{t("Documents")}</h2>
              </div>
              <div className="flex flex-col gap-1">
                {documents.map((d, index) => (
                  <Button
                    key={index}
                    type="button"
                    variant={filterDocument === d.id ? "outline" : "ghost"}
                    onClick={() => {
                      setFilterDocument(d.id);
                      setSelectedItem(null);
                    }}
                    className="flex items-center justify-start gap-2 normal-case w-full"
                  >
                    <div className="shrink-0 relative">
                      {getFileIconByName(d.fileUrl || "")}
                      <span className="absolute -top-1 -right-1 text-[8px] h-4 w-4 flex items-center justify-center bg-amber-500 text-white rounded-full">
                        {reviewCountByDocument(d.id)}
                      </span>
                    </div>
                    <div className="text-sm ml-1 flex items-center truncate w-full whitespace-nowrap">
                      {d.title} 
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Separator */}
            <ArrowSeparator />

            <div className="flex-1 flex flex-col grow space-y-2 min-h-0 p-2">
              {/* Head */}
              <div className="flex items-center justify-between gap-2 shrink-0  pr-5">
                <h2 className="text-sm text-muted-foreground">{t("pendingReviews.list.total", { count: filteredReviews.length })}</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {/* Status */}
                  <Select value={filterStatus} onValueChange={v => setFilterStatus(v as StatusFilter)}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder={t("pendingReviews.list.filter.decision.label")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("pendingReviews.list.filter.decision.options.all")}</SelectItem>
                      <SelectItem value="approved">{t("pendingReviews.list.filter.decision.options.approved")}</SelectItem>
                      <SelectItem value="rejected">{t("pendingReviews.list.filter.decision.options.rejected")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                {/* List */}
                <ScrollArea className="h-full max-h-[calc(100vh-300px)] pr-5 relative"

                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent, black 0%, black 90%, transparent)",
                    maskImage:
                      "linear-gradient(to bottom, transparent, black 0%, black 90%, transparent)",
                    WebkitMaskSize: "100% 100%",
                    maskSize: "100% 100%",
                  }}
                >
                  {filteredReviews.map((r, index) => (
                    <div key={index} className={cn("mb-2", selectedItem?.id === r.id && "sticky top-0 z-10 backdrop-blur-3xl")}>
                      <PendingReviewItem
                        review={r}
                        isSelected={selectedItem?.id === r.id}
                        onSelect={setSelectedItem}
                      />
                    </div>
                  ))}

                  {/* No Data */}
                  {filteredReviews.length === 0 && (
                    <p className="text-muted-foreground p-10 text-center text-sm">
                      {t("pendingReviews.list.empty")}
                    </p>
                  )}
                </ScrollArea>
              </div>
            </div>

            {/* Separator */}
            <ArrowSeparator />

            {/* Preview */}
            <Card className="sticky top-10 flex-1">
              {!selectedItem ? (
                <p className="text-muted-foreground p-10 text-center">
                  {t("pendingReviews.preview.noReviewSelected")}
                </p>
              ) : (
                <PrendingItemPreview review={selectedItem} onSuccess={handleSuccess} />
              )}
            </Card>
          </div>
        </div>
      </div>
    </WithTitle>
  );
}


const ArrowSeparator = () => {
  return (
    <div className="flex items-start gap-1">
      <ArrowRight className="w-4 h-4 text-muted-foreground opacity-45" />
    </div>
  );
}