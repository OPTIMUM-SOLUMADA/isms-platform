import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type ReviewStatus = "pending" | "in_review" | "approved" | "rejected";

type Review = {
  id: string;
  title: string;
  reviewer: string;
  department?: string;
  submittedAt: string;
  excerpt: string;
  rating?: number;
  status: ReviewStatus;
};

const mockData: Review[] = [
  {
    id: "REV-001",
    title: "Proposition de changement de salaire",
    reviewer: "Rija Ramanantsoa",
    department: "Finances",
    submittedAt: "2025-10-10T09:12:00.000Z",
    excerpt: "Demande d'ajustement salarial suite aux responsabilités supplémentaires...",
    rating: 4,
    status: "pending",
  },
  {
    id: "REV-002",
    title: "Rapport mensuel - équipe produit",
    reviewer: "Lala Andriatsima",
    department: "Produit",
    submittedAt: "2025-10-09T14:00:00.000Z",
    excerpt: "Le bilan du mois montre une augmentation des livraisons...",
    rating: 3,
    status: "in_review",
  },
  {
    id: "REV-003",
    title: "Demande de congé exceptionnelle",
    reviewer: "Hery Rakotomalala",
    department: "RH",
    submittedAt: "2025-10-08T07:30:00.000Z",
    excerpt: "Demande de 3 jours de congé pour raisons familiales...",
    rating: 5,
    status: "pending",
  },
  {
    id: "REV-004",
    title: "Proposition de changement de salaire",
    reviewer: "Rija Ramanantsoa",
    department: "Finances",
    submittedAt: "2025-10-10T09:12:00.000Z",
    excerpt: "Demande d'ajustement salarial suite aux responsabilités supplémentaires...",
    rating: 4,
    status: "pending",
  },
  {
    id: "REV-005",
    title: "Rapport mensuel - équipe produit",
    reviewer: "Lala Andriatsima",
    department: "Produit",
    submittedAt: "2025-10-09T14:00:00.000Z",
    excerpt: "Le bilan du mois montre une augmentation des livraisons...",
    rating: 3,
    status: "in_review",
  },
  {
    id: "REV-006",
    title: "Demande de congé exceptionnelle",
    reviewer: "Hery Rakotomalala",
    department: "RH",
    submittedAt: "2025-10-08T07:30:00.000Z",
    excerpt: "Demande de 3 jours de congé pour raisons familiales...",
    rating: 5,
    status: "pending",
  },
];

export default function PendingReviewsDashboardPage(): JSX.Element {
  const [reviews, setReviews] = useState<Review[]>(mockData);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<Review | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let list = reviews.filter((r) => (statusFilter === "all" ? true : r.status === statusFilter));
    if (q.length) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.reviewer.toLowerCase().includes(q) ||
          (r.department ?? "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      const ta = new Date(a.submittedAt).getTime();
      const tb = new Date(b.submittedAt).getTime();
      return sortBy === "newest" ? tb - ta : ta - tb;
    });
    return list;
  }, [reviews, query, statusFilter, sortBy]);

  const toggleSelect = (id: string) => {
    setSelectedIds((s) => ({ ...s, [id]: !s[id] }));
  };

  const singleChangeStatus = (id: string, newStatus: ReviewStatus) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Aperçu — Avis en attente</h1>
          <p className="text-sm text-muted-foreground">Gérez et consultez les avis soumis.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Input
            placeholder="Rechercher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-64"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_review">In review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Plus récents</SelectItem>
              <SelectItem value="oldest">Plus anciens</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <Card key={r.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-medium">{r.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{r.department ?? "—"}</p>
                </div>
                <Checkbox checked={!!selectedIds[r.id]} onCheckedChange={() => toggleSelect(r.id)} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 line-clamp-3">{r.excerpt}</p>
              <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                <span>Par {r.reviewer}</span>
                <Badge variant={r.status === "pending" ? "outline" : "default"}>{r.status}</Badge>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setPreview(r)}>
                  Aperçu
                </Button>
                <Button variant="default" size="sm" onClick={() => singleChangeStatus(r.id, "approved")}>
                  Approuver
                </Button>
                <Button variant="destructive" size="sm" onClick={() => singleChangeStatus(r.id, "rejected")}>
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
                <DialogTitle>{preview.title}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-500 mb-2">{preview.department} — {preview.reviewer}</p>
              <p className="text-gray-700 mb-4">{preview.excerpt}</p>
              <div className="flex justify-end gap-2">
                <Button onClick={() => singleChangeStatus(preview.id, "approved")}>Approuver</Button>
                <Button variant="destructive" onClick={() => singleChangeStatus(preview.id, "rejected")}>
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
