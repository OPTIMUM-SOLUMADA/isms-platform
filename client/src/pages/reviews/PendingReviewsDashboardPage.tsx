import { useMemo, useState } from "react";
import LoadingSplash from "@/components/loading";
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


  if (isLoading) return <LoadingSplash />;

  return (
    <WithTitle title={t("Aperçu — Avis sur documents")}>
      <div className="p-8 space-y-6 flex flex-col grow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{t("Aperçu — Avis sur documents")}</h1>
            <p className="text-sm text-muted-foreground">{t("Liste et statut des révisions de documents.")}</p>
          </div>
          <div className="flex items-center gap-2">

          </div>
        </div>

        <div className="flex flex-col grow h-full">
          <div className="grid gap-4 sm:grid-cols-2 grow minh-0">
            <div className="flex flex-col grow space-y-2 min-h-0">
              {/* Head */}
              <div className="flex items-center justify-between gap-2 shrink-0  pr-5">
                <h2 className="text-sm text-muted-foreground">{t("Total")} ({filteredReviews.length})</h2>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <Select value={filterDocument} onValueChange={setFilterDocument}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Filter by document" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{"Tous"}</SelectItem>
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
                      <SelectValue placeholder="Filter by decision" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{"Tous"}</SelectItem>
                      <SelectItem value="approved">{"Approved"}</SelectItem>
                      <SelectItem value="rejected">{"Change requested"}</SelectItem>
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
                      {t("Aucune revue en attente de validation.")}
                    </p>
                  )}
                </ScrollArea>
              </div>
            </div>

            {/* Preview */}
            <Card className="sticky top-10">
              {!selectedItem ? (
                <p className="text-muted-foreground p-10 text-center">
                  {t("Please select a review to preview its details.")}
                </p>
              ) : (
                <PrendingItemPreview review={selectedItem} />
              )}
            </Card>
          </div>
        </div>
      </div>
    </WithTitle>
  );
}
