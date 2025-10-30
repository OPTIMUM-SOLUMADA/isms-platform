import { useMemo, useState } from "react";
import { PendingReviewItem, PrendingItemPreview } from "@/templates/reviews/PendingReviewItem";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useFetchPendingReviews } from "@/hooks/queries/useReviewMutation";
import WithTitle from "@/templates/layout/WithTitle";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DocumentReview } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import CircleLoading from "@/components/loading/CircleLoading";

type StatusFilter = "approved" | "rejected" | "all";

export default function PendingReviewsDashboardPage(): JSX.Element {
  const [filterDocument, setFilterDocument] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<StatusFilter>("all");
  const [selectedItem, setSelectedItem] = useState<DocumentReview | null>(null);
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

        <div className="flex flex-col grow h-full">
          <div className="grid gap-4 sm:grid-cols-2 grow minh-0">
            <div className="flex flex-col grow space-y-2 min-h-0">
              {/* Head */}
              <div className="flex items-center justify-between gap-2 shrink-0  pr-5">
                <h2 className="text-sm text-muted-foreground">{t("pendingReviews.list.total", { count: filteredReviews.length })}</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Select value={filterDocument} onValueChange={setFilterDocument}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder={t("pendingReviews.list.filter.document.label")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("pendingReviews.list.filter.document.options.all")}</SelectItem>
                      {documents.map((d, index) => (
                        <SelectItem key={index} value={d.id}>
                          {d.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

            {/* Preview */}
            <Card className="sticky top-10">
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
