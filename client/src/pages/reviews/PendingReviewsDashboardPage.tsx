import { useMemo, useState } from "react";
import { useFetchPendingReviews } from "@/hooks/queries/usePendingReviewsMutations";
import LoadingSplash from "@/components/loading";
import { PendingReviewItem } from "@/templates/reviews/PendingReviewItem";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Filter } from "lucide-react";

export default function PendingReviewsDashboardPage(): JSX.Element {
  const [filterDocument, setFilterDocument] = useState<string>("all");

  const { data, isLoading } = useFetchPendingReviews();

  const documents = useMemo(() => {
    if (!data) return [];
    return data.map((d) => d.document).filter(d => !!d);
  }, [data]);

  const filteredReviews = useMemo(() => {
    if (!data) return [];
    if (filterDocument === "all") return data;
    return data.filter((r) => r.documentId === filterDocument);
  }, [data, filterDocument]);

  if (isLoading) return <LoadingSplash />;

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Aperçu — Avis sur documents</h1>
          <p className="text-sm text-muted-foreground">Liste et statut des révisions de documents.</p>
        </div>
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

        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredReviews.map((r, index) => (
          <div key={index}>
            <PendingReviewItem review={r} />
          </div>
        ))}
      </div>
    </div>
  );
}
