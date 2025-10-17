import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useFetchPendingReviews } from "@/hooks/queries/usePendingReviewsMutations";
import LoadingSplash from "@/components/loading";
import HtmlContent from "@/components/HTMLContent";
import { UserHoverCard } from "@/templates/users/hovercard/UserHoverCard";

type ReviewDecision = "approved" | "rejected" | "pending";

type DocumentReview = {
  id: string;
  documentId: string;
  reviewerId: string;
  assignedById?: string | null;
  comment?: string;
  decision?: ReviewDecision;
  isCompleted: boolean;
  reviewDate?: string;
  documentVersionId: string;
  reviewerName: string;
  documentTitle: string;
  department?: string;
  dueDate: string;
};

export default function PendingReviewsDashboardPage(): JSX.Element {
  // const [reviews, setReviews] = useState<DocumentReview[]>(mockData);
  const [query, setQuery] = useState("");
  const [decisionFilter, setDecisionFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<DocumentReview | null>(null);

  const  { data, isLoading, error }   = useFetchPendingReviews();
  // const filtered = useMemo(() => {
  //   const q = query.toLowerCase();
  //   let list = reviews.filter((r) => (decisionFilter === "all" ? true : r.decision === decisionFilter));
  //   if (q.length) {
  //     list = list.filter(
  //       (r) =>
  //         r.documentTitle.toLowerCase().includes(q) ||
  //         r.reviewerName.toLowerCase().includes(q) ||
  //         (r.department ?? "").toLowerCase().includes(q)
  //     );
  //   }
  //   return list;
  // }, [reviews, query, decisionFilter]);

  console.log('pending', data,  isLoading, error );
  
  const toggleSelect = (id: string) => {
    setSelectedIds((s) => ({ ...s, [id]: !s[id] }));
  };

  // const singleChangeDecision = (id: string, decision: ReviewDecision) => {
  //   setReviews(user)
  // };

  if(isLoading) return <LoadingSplash />

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Aperçu — Avis sur documents</h1>
          <p className="text-sm text-muted-foreground">Liste et statut des révisions de documents.</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.isArray(data) && data.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-medium">{r.document?.title}</CardTitle>
                  {/* <p className="text-sm text-muted-foreground">{r.department  ?? "—"}</p> */}
                </div>
                <Checkbox checked={!!selectedIds[r.id]} onCheckedChange={() => toggleSelect(r.id)} />
              </div>
            </CardHeader>
            <CardContent>
              <HtmlContent html={r.comment ?? "Aucun commentaire"}/>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <div className="flex">Par <UserHoverCard user={r.reviewer}  /> </div>
                <Badge variant={r.decision === "APPROVE" ? "outline" : "default"}>{r.decision}</Badge>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                {/* <Button variant="outline" size="sm" onClick={() => setPreview(r)}>
                  Aperçu
                </Button> */}
                {/* <Button variant="default" size="sm" onClick={() => singleChangeDecision(r.id, "approved")}>
                  Approuver
                </Button>
                <Button variant="destructive" size="sm" onClick={() => singleChangeDecision(r.id, "rejected")}>
                  Rejeter
                </Button> */}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-xl">
          {preview && (
            <>
              <DialogHeader>
                <DialogTitle>{preview.documentTitle}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-500 mb-2">{preview.department} — {preview.reviewerName}</p>
              <p className="text-gray-700 mb-4">{preview.comment ?? "Aucun commentaire."}</p>
              <div className="flex justify-end gap-2">
                {/* <Button onClick={() => singleChangeDecision(preview.id, "approved")}>Approuver</Button>
                <Button variant="destructive" onClick={() => singleChangeDecision(preview.id, "rejected")}>
                  Rejeter
                </Button> */}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
