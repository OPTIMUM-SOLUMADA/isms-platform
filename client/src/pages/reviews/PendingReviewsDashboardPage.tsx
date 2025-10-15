import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
};

const mockData: DocumentReview[] = [
  {
    id: "6710d01b99d4f8b2a5a11111",
    documentId: "670fa01b22b4c8b3a1c00123",
    reviewerId: "670fa01b22b4c8b3a1c04567",
    assignedById: "670fa01b22b4c8b3a1c07890",
    comment: "Besoin de clarifier la section sur les responsabilités.",
    decision: "pending",
    isCompleted: false,
    documentVersionId: "670fa01b22b4c8b3a1c09999",
    reviewerName: "Rija Ramanantsoa",
    documentTitle: "Politique de sécurité - v2",
    department: "Sécurité",
  },
  {
    id: "6710d01b99d4f8b2a5a12222",
    documentId: "670fa01b22b4c8b3a1c00222",
    reviewerId: "670fa01b22b4c8b3a1c04678",
    assignedById: null,
    comment: "RAS, conforme aux standards internes.",
    decision: "approved",
    isCompleted: true,
    reviewDate: "2025-10-11T14:30:00.000Z",
    documentVersionId: "670fa01b22b4c8b3a1c01000",
    reviewerName: "Hery Rakotomalala",
    documentTitle: "Procédure d'accès aux locaux - v1",
    department: "RH",
  },
  {
    id: "6710d01b99d4f8b2a5a13333",
    documentId: "670fa01b22b4c8b3a1c00333",
    reviewerId: "670fa01b22b4c8b3a1c04789",
    assignedById: "670fa01b22b4c8b3a1c07890",
    comment: "Les chiffres doivent être mis à jour.",
    decision: "rejected",
    isCompleted: true,
    reviewDate: "2025-10-10T10:00:00.000Z",
    documentVersionId: "670fa01b22b4c8b3a1c01111",
    reviewerName: "Lala Andriatsima",
    documentTitle: "Politique financière - Q4",
    department: "Finance",
  },
  {
    id: "6710d01b99d4f8b2a5a14444",
    documentId: "670fa01b22b4c8b3a1c00444",
    reviewerId: "670fa01b22b4c8b3a1c04890",
    assignedById: null,
    comment: undefined,
    decision: "pending",
    isCompleted: false,
    documentVersionId: "670fa01b22b4c8b3a1c01222",
    reviewerName: "Miora Razanadrakoto",
    documentTitle: "Charte informatique - v3",
    department: "IT",
  },
];

export default function PendingReviewsDashboardPage(): JSX.Element {
  const [reviews, setReviews] = useState<DocumentReview[]>(mockData);
  const [query, setQuery] = useState("");
  const [decisionFilter, setDecisionFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<DocumentReview | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let list = reviews.filter((r) => (decisionFilter === "all" ? true : r.decision === decisionFilter));
    if (q.length) {
      list = list.filter(
        (r) =>
          r.documentTitle.toLowerCase().includes(q) ||
          r.reviewerName.toLowerCase().includes(q) ||
          (r.department ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [reviews, query, decisionFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((s) => ({ ...s, [id]: !s[id] }));
  };

  const singleChangeDecision = (id: string, decision: ReviewDecision) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, decision, isCompleted: decision !== "pending" } : r))
    );
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Aperçu — Avis sur documents</h1>
          <p className="text-sm text-muted-foreground">Liste et statut des révisions de documents.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Rechercher un document..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
          <Select value={decisionFilter} onValueChange={setDecisionFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrer par décision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="approved">Approuvé</SelectItem>
              <SelectItem value="rejected">Rejeté</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <Card key={r.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base font-medium">{r.documentTitle}</CardTitle>
                  <p className="text-sm text-muted-foreground">{r.department ?? "—"}</p>
                </div>
                <Checkbox checked={!!selectedIds[r.id]} onCheckedChange={() => toggleSelect(r.id)} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 line-clamp-3">{r.comment ?? "Aucun commentaire fourni."}</p>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <span>Par {r.reviewerName}</span>
                <Badge variant={r.decision === "pending" ? "outline" : "default"}>{r.decision}</Badge>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreview(r)}>
                  Aperçu
                </Button>
                <Button variant="default" size="sm" onClick={() => singleChangeDecision(r.id, "approved")}>
                  Approuver
                </Button>
                <Button variant="destructive" size="sm" onClick={() => singleChangeDecision(r.id, "rejected")}>
                  Rejeter
                </Button>
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
                <Button onClick={() => singleChangeDecision(preview.id, "approved")}>Approuver</Button>
                <Button variant="destructive" onClick={() => singleChangeDecision(preview.id, "rejected")}>
                  Rejeter
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
